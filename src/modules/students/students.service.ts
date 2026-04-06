import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Student } from './entities/student.entity';
import { User } from '../users/entities/user.entity';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto, UpdateStudentProfileDto } from './dto/update-student.dto';
import { FindStudentsQueryDto } from './dto/find-students-query.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class StudentsService {
  constructor(
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(dto: CreateStudentDto): Promise<Student> {
    const existingUser = await this.userRepository.findOne({
      where: [{ email: dto.email }, { id: dto.dni }],
    });
    if (existingUser) {
      throw new ConflictException('El email o DNI ya están registrados');
    }

    const tempPassword = this.generateTempPassword();
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    const user = this.userRepository.create({
      name: dto.name,
      lastname: dto.lastname,
      email: dto.email,
      password: hashedPassword,
      role: 'STUDENT' as any,
    });
    const savedUser = await this.userRepository.save(user);

    const student = this.studentRepository.create({
      userId: savedUser.id,
      planId: dto.planId,
      dni: dto.dni,
      birthDate: new Date(dto.birthDate),
      phone: dto.phone,
      address: dto.address,
      startDate: new Date(dto.startDate),
    });

    return this.studentRepository.save(student);
  }

  async findAll(query: FindStudentsQueryDto) {
    const page = query.page || 1;
    const limit = query.limit || 20;
    const skip = (page - 1) * limit;

    const qb = this.studentRepository
      .createQueryBuilder('student')
      .leftJoinAndSelect('student.user', 'user')
      .leftJoinAndSelect('student.plan', 'plan');

    if (query.search) {
      qb.andWhere(
        '(user.name ILIKE :search OR user.lastname ILIKE :search OR student.dni ILIKE :search)',
        { search: `%${query.search}%` },
      );
    }

    if (query.planId) {
      qb.andWhere('student.planId = :planId', { planId: query.planId });
    }

    if (query.isActive !== undefined) {
      qb.andWhere('student.isActive = :isActive', { isActive: query.isActive });
    }

    const [data, total] = await qb
      .orderBy('student.createdAt', 'DESC')
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return {
      data,
      meta: {
        total,
        page,
        limit,
        lastPage: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string): Promise<Student> {
    const student = await this.studentRepository.findOne({
      where: { id },
      relations: ['user', 'plan'],
    });
    if (!student) throw new NotFoundException('Alumno no encontrado');
    return student;
  }

  async findByUserId(userId: string): Promise<Student> {
    const student = await this.studentRepository.findOne({
      where: { userId },
      relations: ['user', 'plan'],
    });
    if (!student) throw new NotFoundException('Alumno no encontrado');
    return student;
  }

  async update(id: string, dto: UpdateStudentDto): Promise<Student> {
    const student = await this.findOne(id);

    if (dto.planId) {
      student.planId = dto.planId;
    }
    if (dto.isActive !== undefined) {
      student.isActive = dto.isActive;
    }

    if (dto.name || dto.lastname) {
      const user = await this.userRepository.findOne({
        where: { id: student.userId },
      });
      if (user) {
        if (dto.name) user.name = dto.name;
        if (dto.lastname) user.lastname = dto.lastname;
        await this.userRepository.save(user);
      }
    }

    return this.studentRepository.save(student);
  }

  async updateProfile(userId: string, dto: UpdateStudentProfileDto): Promise<Student> {
    const student = await this.findByUserId(userId);

    const user = await this.userRepository.findOne({
      where: { id: student.userId },
    });
    if (user) {
      if (dto.name) user.name = dto.name;
      if (dto.lastname) user.lastname = dto.lastname;
      await this.userRepository.save(user);
    }

    if (dto.phone) student.phone = dto.phone;
    if (dto.address) student.address = dto.address;

    return this.studentRepository.save(student);
  }

  async deactivate(id: string): Promise<Student> {
    const student = await this.findOne(id);
    student.isActive = false;

    const user = await this.userRepository.findOne({
      where: { id: student.userId },
    });
    if (user) {
      user.isActive = false;
      await this.userRepository.save(user);
    }

    return this.studentRepository.save(student);
  }

  async reactivate(id: string): Promise<Student> {
    const student = await this.findOne(id);
    student.isActive = true;

    const user = await this.userRepository.findOne({
      where: { id: student.userId },
    });
    if (user) {
      user.isActive = true;
      await this.userRepository.save(user);
    }

    return this.studentRepository.save(student);
  }

  private generateTempPassword(): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
    let password = '';
    for (let i = 0; i < 8; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  }
}

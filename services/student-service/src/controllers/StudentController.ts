import { Request, Response, NextFunction } from 'express';
import { StudentService } from '../services';

class StudentController {
  /**
   * GET /students/:id
   * Get student detail with progress, assessments, and recent attempts
   */
  async getStudentDetail(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const student = await StudentService.getStudentDetail(id);
      res.json(student);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /students/parent/:guardianId
   * Get all students for a guardian
   */
  async getStudentsByGuardian(req: Request, res: Response, next: NextFunction) {
    try {
      const { guardianId } = req.params;
      const students = await StudentService.getStudentsByGuardianId(guardianId);
      console.log('[StudentController] Retrieved students for guardianId:', guardianId, 'Count:', students.length);
      res.json(students);
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /students
   * Create a new student
   */
  async createStudent(req: Request, res: Response, next: NextFunction) {
    try {
      const student = await StudentService.createStudent(req.body);
      res.status(201).json(student);
    } catch (error) {
      next(error);
    }
  }

  /**
   * PATCH /students/:id
   * Update a student
   */
  async updateStudent(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const student = await StudentService.updateStudent(id, req.body);
      res.json(student);
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /students/:id
   * Soft delete a student
   */
  async deleteStudent(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const student = await StudentService.deleteStudent(id);
      res.json(student);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /students/lookup
   * Lookup student by email
   */
  async lookupByEmail(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email } = req.query;
      if (!email || typeof email !== 'string') {
        res.status(400).json({ error: 'email query parameter is required' });
        return;
      }
      const student = await StudentService.getStudentByEmail(email);
      if (!student) {
        res.status(404).json({ error: 'Student not found' });
        return;
      }
      res.json(student);
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /students/:id/unlink
   * Unlink student from guardian
   */
  async unlinkFromGuardian(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const guardianId = req.headers['x-user-id'] as string;
      if (!guardianId) {
        res.status(401).json({ error: 'Guardian ID required' });
        return;
      }
      const student = await StudentService.unlinkFromGuardian(id, guardianId);
      res.json(student);
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /students/:id/link
   * Link student to guardian
   */
  async linkToGuardian(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const guardianId = req.headers['x-user-id'] as string;
      if (!guardianId) {
        res.status(401).json({ error: 'Guardian ID required' });
        return;
      }
      const student = await StudentService.linkToGuardian(id, guardianId);
      res.json(student);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /students/:id/verify-ownership
   * Verify student belongs to guardian
   */
  async verifyOwnership(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const guardianId = req.headers['x-user-id'] as string;
      if (!guardianId) {
        res.status(401).json({ error: 'Guardian ID required' });
        return;
      }
      const isOwner = await StudentService.verifyStudentOwnership(
        id,
        guardianId,
      );
      res.json({ isOwner });
    } catch (error) {
      next(error);
    }
  }
}

export default new StudentController();

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const services_1 = require("../services");
class StudentController {
    async getStudentDetail(req, res, next) {
        try {
            const { id } = req.params;
            const student = await services_1.StudentService.getStudentDetail(id);
            res.json(student);
        }
        catch (error) {
            next(error);
        }
    }
    async getStudentsByParent(req, res, next) {
        try {
            const { guardianId } = req.params;
            const students = await services_1.StudentService.getStudentsByGuardianId(guardianId);
            res.json(students);
        }
        catch (error) {
            next(error);
        }
    }
    async createStudent(req, res, next) {
        try {
            const student = await services_1.StudentService.createStudent(req.body);
            res.status(201).json(student);
        }
        catch (error) {
            next(error);
        }
    }
    async updateStudent(req, res, next) {
        try {
            const { id } = req.params;
            const student = await services_1.StudentService.updateStudent(id, req.body);
            res.json(student);
        }
        catch (error) {
            next(error);
        }
    }
    async deleteStudent(req, res, next) {
        try {
            const { id } = req.params;
            const student = await services_1.StudentService.deleteStudent(id);
            res.json(student);
        }
        catch (error) {
            next(error);
        }
    }
    async lookupByEmail(req, res, next) {
        try {
            const { email } = req.query;
            if (!email || typeof email !== 'string') {
                res.status(400).json({ error: 'email query parameter is required' });
                return;
            }
            const student = await services_1.StudentService.getStudentByEmail(email);
            if (!student) {
                res.status(404).json({ error: 'Student not found' });
                return;
            }
            res.json(student);
        }
        catch (error) {
            next(error);
        }
    }
    async unlinkFromGuardian(req, res, next) {
        try {
            const { id } = req.params;
            const guardianId = req.headers['x-user-id'];
            if (!guardianId) {
                res.status(401).json({ error: 'Guardian ID required' });
                return;
            }
            const student = await services_1.StudentService.unlinkFromGuardian(id, guardianId);
            res.json(student);
        }
        catch (error) {
            next(error);
        }
    }
    async linkToGuardian(req, res, next) {
        try {
            const { id } = req.params;
            const guardianId = req.headers['x-user-id'];
            if (!guardianId) {
                res.status(401).json({ error: 'Guardian ID required' });
                return;
            }
            const student = await services_1.StudentService.linkToGuardian(id, guardianId);
            res.json(student);
        }
        catch (error) {
            next(error);
        }
    }
    async verifyOwnership(req, res, next) {
        try {
            const { id } = req.params;
            const guardianId = req.headers['x-user-id'];
            if (!guardianId) {
                res.status(401).json({ error: 'Guardian ID required' });
                return;
            }
            const isOwner = await services_1.StudentService.verifyStudentOwnership(id, guardianId);
            res.json({ isOwner });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.default = new StudentController();
//# sourceMappingURL=StudentController.js.map
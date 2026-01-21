declare class ExerciseService {
    getExercisesByLevel(readingLevel: string, options?: {
        skillStrand?: string;
        type?: string;
        limit?: number;
        skip?: number;
    }): Promise<(import("mongoose").Document<unknown, {}, import("../db/models").IExercise, {}, {}> & import("../db/models").IExercise & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    getExerciseById(exerciseId: string): Promise<import("mongoose").Document<unknown, {}, import("../db/models").IExercise, {}, {}> & import("../db/models").IExercise & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    getExerciseForStudent(exerciseId: string): Promise<import("mongoose").Document<unknown, {}, import("../db/models").IExercise, {}, {}> & import("../db/models").IExercise & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    createExercise(data: {
        title: string;
        description?: string;
        type: string;
        readingLevel: string;
        skillStrand: string;
        estimatedTime?: number;
        points?: number;
        order?: number;
        questions: Array<{
            questionText: string;
            questionType: string;
            options?: string[];
            correctAnswer: string;
            points?: number;
            explanation?: string;
        }>;
        tags?: string[];
        prerequisites?: string[];
    }): Promise<import("mongoose").Document<unknown, {}, import("../db/models").IExercise, {}, {}> & import("../db/models").IExercise & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    updateExercise(exerciseId: string, data: Partial<{
        title: string;
        description: string;
        type: string;
        readingLevel: string;
        skillStrand: string;
        estimatedTime: number;
        points: number;
        order: number;
        questions: Array<{
            questionText: string;
            questionType: string;
            options?: string[];
            correctAnswer: string;
            points?: number;
            explanation?: string;
        }>;
        tags: string[];
        prerequisites: string[];
        isActive: boolean;
    }>): Promise<import("mongoose").Document<unknown, {}, import("../db/models").IExercise, {}, {}> & import("../db/models").IExercise & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    deleteExercise(exerciseId: string): Promise<import("mongoose").Document<unknown, {}, import("../db/models").IExercise, {}, {}> & import("../db/models").IExercise & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    getExerciseCountByLevel(readingLevel: string): Promise<number>;
}
declare const _default: ExerciseService;
export default _default;
//# sourceMappingURL=ExerciseService.d.ts.map
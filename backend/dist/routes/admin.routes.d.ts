import express from 'express';
declare const router: import("express-serve-static-core").Router;
declare function requireAdmin(req: express.Request, res: express.Response, next: express.NextFunction): Promise<express.Response<any, Record<string, any>> | undefined>;
export { requireAdmin };
export default router;
//# sourceMappingURL=admin.routes.d.ts.map
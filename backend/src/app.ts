import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { errorHandler } from './middleware/errorHandler';
import { requestLogger } from './middleware/requestLogger';
import authRoutes from './modules/auth';
import userRoutes from './modules/users';
import subjectRoutes from './modules/subjects';
import sectionRoutes from './modules/sections';
import videoRoutes from './routes/videoRoutes';
import progressRoutes from './modules/progress';
import healthRoutes from './modules/health';
import subscriptionRoutes from "./routes/subscription.routes";

const app = express();
app.use(
  cors({
    origin: true,
    credentials: true
  })
);

app.use(helmet());
app.use(morgan('combined'));
app.use(express.json());
app.use(requestLogger);
app.get("/",(req,res)=>{
  res.send("Backend is running");
});
// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/subjects', subjectRoutes);
app.use('/api/sections', sectionRoutes);
app.use('/api/videos', videoRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/health', healthRoutes);
app.use("/api/subscriptions", subscriptionRoutes);

app.use(errorHandler);

export default app;
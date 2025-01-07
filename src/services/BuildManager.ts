import { FileService } from './FileService';
import path from 'path';

export class BuildManager {
  private static instance: BuildManager;
  private fileService: FileService;
  private readonly artifactsDir: string;
  private readonly sourceDir: string;

  private constructor() {
    this.fileService = FileService.getInstance();
    this.artifactsDir = path.join(process.cwd(), 'artifacts');
    this.sourceDir = path.join(process.cwd(), 'src');
  }

  public static getInstance(): BuildManager {
    if (!BuildManager.instance) {
      BuildManager.instance = new BuildManager();
    }
    return BuildManager.instance;
  }

  async initializeDirectories(): Promise<void> {
    try {
      await this.fileService.verifyPath(this.artifactsDir);
    } catch (error) {
      console.error('Failed to initialize directories:', error);
      throw error;
    }
  }

  async backupFile(filePath: string): Promise<void> {
    try {
      await this.fileService.createBackup(filePath);
    } catch (error) {
      console.error('Failed to backup file:', error);
      throw error;
    }
  }

  async backupDirectory(dirPath: string): Promise<void> {
    try {
      const files = await this.fileService.listFiles(dirPath);
      
      for (const file of files) {
        const fullPath = path.join(dirPath, file);
        await this.fileService.createBackup(fullPath);
      }
    } catch (error) {
      console.error('Failed to backup directory:', error);
      throw error;
    }
  }

  async verifyArtifact(artifact: string): Promise<void> {
    try {
      await this.fileService.verifyPath(artifact);
    } catch (error) {
      console.error('Failed to verify artifact:', error);
      throw error;
    }
  }

  async restoreFile(file: string): Promise<void> {
    try {
      const latestBackup = await this.fileService.getLatestBackup(path.basename(file));
      
      if (latestBackup) {
        await this.fileService.restoreFromBackup(latestBackup, file);
      } else {
        throw new Error(`No backup found for ${file}`);
      }
    } catch (error) {
      console.error('Failed to restore file:', error);
      throw error;
    }
  }

  async clearArtifacts(): Promise<void> {
    try {
      const files = await this.fileService.listFiles(this.artifactsDir);
      
      for (const file of files) {
        await this.fileService.deleteFile(path.join(this.artifactsDir, file));
      }
    } catch (error) {
      console.error('Failed to clear artifacts:', error);
      throw error;
    }
  }
}
import fs from 'fs/promises';
import path from 'path';

export class FileService {
  private static instance: FileService;
  private backupDir: string;

  private constructor() {
    this.backupDir = path.join(process.cwd(), '.backups');
  }

  public static getInstance(): FileService {
    if (!FileService.instance) {
      FileService.instance = new FileService();
    }
    return FileService.instance;
  }

  async verifyPath(filePath: string): Promise<void> {
    try {
      await fs.access(filePath);
    } catch {
      const dir = path.dirname(filePath);
      await fs.mkdir(dir, { recursive: true });
    }
  }

  async createBackup(filePath: string): Promise<void> {
    try {
      await this.verifyPath(this.backupDir);
      
      const timestamp = new Date().toISOString().replace(/[:\/\\]/g, '-');
      const fileName = path.basename(filePath);
      const backupPath = path.join(this.backupDir, `${fileName}.${timestamp}.bak`);
      
      await fs.copyFile(filePath, backupPath);
    } catch (error) {
      console.error('Backup creation failed:', error);
      throw error;
    }
  }

  async restoreFromBackup(backupPath: string, targetPath: string): Promise<void> {
    try {
      await this.verifyPath(path.dirname(targetPath));
      await fs.copyFile(backupPath, targetPath);
    } catch (error) {
      console.error('Backup restoration failed:', error);
      throw error;
    }
  }

  async readFile(filePath: string): Promise<string> {
    try {
      return await fs.readFile(filePath, 'utf-8');
    } catch (error) {
      console.error('File read failed:', error);
      throw error;
    }
  }

  async writeFile(filePath: string, content: string): Promise<void> {
    try {
      await this.verifyPath(path.dirname(filePath));
      await fs.writeFile(filePath, content, 'utf-8');
    } catch (error) {
      console.error('File write failed:', error);
      throw error;
    }
  }

  async listFiles(dirPath: string): Promise<string[]> {
    try {
      await this.verifyPath(dirPath);
      return await fs.readdir(dirPath);
    } catch (error) {
      console.error('Directory listing failed:', error);
      throw error;
    }
  }

  async getLatestBackup(fileName: string): Promise<string | null> {
    try {
      const files = await this.listFiles(this.backupDir);
      const backups = files
        .filter(f => f.startsWith(fileName))
        .sort()
        .reverse();
      
      return backups.length > 0 
        ? path.join(this.backupDir, backups[0])
        : null;
    } catch (error) {
      console.error('Failed to get latest backup:', error);
      return null;
    }
  }

  async deleteFile(filePath: string): Promise<void> {
    try {
      await fs.unlink(filePath);
    } catch (error) {
      console.error('File deletion failed:', error);
      throw error;
    }
  }
}
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class CronService {
  private readonly logger = new Logger(CronService.name);
  private readonly publicDir = path.join(process.cwd(), 'public');

  constructor() {
    this.logger.log('CronService initialized');
  }

  /**
   * 每日凌晨清空public目录下的所有文件夹
   * 使用CronExpression.CRON_DAILY表示每天凌晨执行
   */
  @Cron(CronExpression.EVERY_WEEKEND)
  async cleanPublicDirectory() {
    this.logger.log('开始执行定时任务: 清空public目录');
    
    try {
      // 检查public目录是否存在
      if (!fs.existsSync(this.publicDir)) {
        this.logger.warn(`public目录不存在: ${this.publicDir}`);
        return;
      }

      // 读取public目录下的所有内容
      const items = fs.readdirSync(this.publicDir);
      let deletedCount = 0;

      for (const item of items) {
        const itemPath = path.join(this.publicDir, item);
        const stats = fs.statSync(itemPath);

        // 只删除文件夹,保留文件
        if (stats.isDirectory()) {
          try {
            // 递归删除文件夹及其内容
            fs.rmSync(itemPath, { recursive: true, force: true });
            deletedCount++;
            this.logger.log(`已删除文件夹: ${item}`);
          } catch (error) {
            this.logger.error(`删除文件夹失败: ${item}`, error.message);
          }
        }
      }

      this.logger.log(`定时任务执行完成,共删除 ${deletedCount} 个文件夹`);
    } catch (error) {
      this.logger.error('执行定时任务时发生错误', error.stack);
    }
  }

  /**
   * 手动触发清空public目录的方法(用于测试)
   */
  async cleanPublicDirectoryManually() {
    this.logger.log('手动触发清空public目录任务');
    await this.cleanPublicDirectory();
  }


  // 使用 Cron 表达式：每个工作日（周一至周五）的12、18执行
  @Cron('0 12 * * 1-5')
  @Cron('0 18 * * 1-5')
  handleOffWork() {
    this.logger.log('工作日12、18的任务执行了！');
    // 在这里编写你的业务逻辑
  }

  // 使用 Cron 表达式：每个工作日（周一至周五）的8.30、13.30执行
  @Cron('0 30 8 * * 1-5')
  @Cron('0 30 13 * * 1-5')
  handleGoToWork() {
    this.logger.log('工作日8.30、13.30的任务执行了！');
    // 在这里编写你的业务逻辑
  }


  @Cron(CronExpression.EVERY_MINUTE)
  handleTest() {
    this.logger.log('工作日test的任务执行了！');
    // 在这里编写你的业务逻辑
    // this.socketGateway.wss.emit('alert', {
    //   message: '测试定时任务',
    //   sender:'系统通知'
    // })
  }

}
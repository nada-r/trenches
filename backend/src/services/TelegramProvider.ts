import TelegramBot from 'node-telegram-bot-api';
import AWS from 'aws-sdk';
import axios from 'axios';

// TODO CDN can be extracted
export class TelegramProvider {
  constructor() {}

  async handleUserProfileImage(
    bot: TelegramBot,
    userId: number,
    s3: AWS.S3,
    botToken: string,
    isNormalUser: boolean
  ): Promise<string | undefined> {
    const s3Key = `profile_pictures/${userId}.jpg`;

    try {
      try {
        await s3
          .headObject({
            Bucket: process.env.CDN_SPACE_NAME as string,
            Key: s3Key,
          })
          .promise();

        // console.log(`Profile picture already exists: ${s3Key}`);
        return `https://${process.env.CDN_SPACE_NAME}.${process.env.CDN_ENDPOINT}/profile_pictures/${userId}.jpg`;
      } catch (err) {
        if (err.code !== 'NotFound') {
          throw err; // Handle other errors
        }
        console.log('Image does not exist, proceeding with upload...');
      }

      let fileId;
      if (isNormalUser) {
        const photos = await bot.getUserProfilePhotos(userId);
        if (photos.total_count > 0) fileId = photos.photos[0][0].file_id;
      } else {
        const chat = await bot.getChat(userId);
        if (chat.photo) fileId = chat.photo.big_file_id;
      }
      if (fileId) {
        const file = await bot.getFile(fileId);

        const fileUrl = `https://api.telegram.org/file/bot${botToken}/${file.file_path}`;
        const response = await axios.get(fileUrl, {
          responseType: 'arraybuffer',
        });

        const params = {
          Bucket: process.env.CDN_SPACE_NAME as string,
          Key: s3Key,
          Body: response.data,
          ACL: 'public-read',
          ContentType: 'image/jpeg',
        };

        const uploadResult = await s3.putObject(params).promise();
        console.log(
          `Successfully uploaded image to DigitalOcean Space: ${uploadResult}`
        );

        return `https://${process.env.CDN_SPACE_NAME}.${process.env.CDN_ENDPOINT}/profile_pictures/${userId}.jpg`;
      }
    } catch (error) {
      console.error('Error fetching or uploading profile photo:', error);
      return undefined;
    }

    return undefined;
  }
}
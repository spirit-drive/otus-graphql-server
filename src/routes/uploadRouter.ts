import { Router } from 'express';
import { UploadedFile } from 'express-fileupload';
import * as path from 'path';
import * as config from '../config.json';
import * as fs from 'fs';
export const uploadRouter = Router();

export const assetsPath = path.join(process.cwd(), 'assets');

uploadRouter.post('/', function (req, res) {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).json({ errors: [{ error: 'No files were uploaded' }] });
  }

  const file = req.files.file as UploadedFile;
  const name = encodeURI(file.name);
  if (!fs.existsSync(assetsPath)) fs.mkdirSync(assetsPath);

  const uploadPath = path.join(assetsPath, name);

  file.mv(uploadPath, function (err) {
    if (err) return res.status(500).json({ errors: [{ error: err }] });
    res.send({ url: `${config.url}/img/${name}` });
  });
});

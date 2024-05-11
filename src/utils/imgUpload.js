/* eslint-disable prettier/prettier */

/* eslint-disable import/no-extraneous-dependencies */

import multer from "multer";
import path from 'node:path'

const storage = multer.diskStorage({
    destination:(req,file,cb)=>{
      cb(null,'src/images')
    },
    filename:(req,file,cb)=>{
      cb(null,Date.now() + path.extname(file.originalname) )
    }
  });
  
  const upload = multer({storage: storage });
  export default upload;
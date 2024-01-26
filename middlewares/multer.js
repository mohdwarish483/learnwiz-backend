import multer from "multer"; // for processing files locally or storing files locally

const storage = multer.memoryStorage();

const singleUpload = multer({ storage }).single("file"); 

export default singleUpload;
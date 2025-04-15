import multer from "multer"

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./public/temp")    // Store files in "./public/temp" folder
    },

    filename: function (req, file, cb){
        cb(null, file.originalname)  // Keep original file name
    }
})

export const upload = multer({
     storage : storage
})

/*
Multer is a Node.js middleware mainly used for uploading files.
It processes incoming files before passing them to your route handlers.
Supports disk storage (saving files to disk) and memory storage (storing files in RAM).
Allows setting limits on file size, file types, and destinations.
*/


// The destination function sets the folder where uploaded files will be stored.
// cb(null, 'uploads/') tells Multer to save files inside the "uploads" folder.
// The filename function sets the name of the uploaded file. In this case, it keeps the original name of the file.

//? Inside multer.diskStorage({...}):
// These are only related to how files are stored on disk.
// destination: Defines where the files will be stored.
// filename: Defines how the file will be named.


//? Inside multer({...}):
// These apply to overall file handling:
// storage: Defines the storage engine (diskStorage() or memoryStorage()).
// fileFilter: Filters files based on type.
// limits: Sets restrictions like file size, number of files, etc.



//! we can also use multer like this:
// const upload = multer({
//     storage: storage, // Use the storage configuration above
//     fileFilter: (req, file, cb) => {
//       if (file.mimetype === 'image/png' || file.mimetype === 'image/jpeg')        // Check if the file is a PNG or JPEG image
//       {
//         cb(null, true); // null means no error and true means Accept file
//       } else {
//         cb(new Error('Only PNG and JPEG files are allowed!'), false); // Reject file
//       }
//     },
//     limits: {
//       fileSize: 2 * 1024 * 1024 // Limit file size to 2MB
//     }
//   });
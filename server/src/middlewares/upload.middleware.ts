import multer from "multer";

const storage = multer.memoryStorage();

const allowedMimeTypes = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
];

export const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter: (_req, file, cb) => {
    if (!allowedMimeTypes.includes(file.mimetype)) {
      cb(new Error("Only JPG, PNG, WEBP, and PDF files are allowed"));
      return;
    }

    cb(null, true);
  },
});

export const uploadRestaurantRegistrationFiles = upload.fields([
  { name: "logo", maxCount: 1 },
  { name: "banner", maxCount: 1 },
  { name: "businessLicense", maxCount: 1 },
  { name: "ownerIdDocument", maxCount: 1 },
]);

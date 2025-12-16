import catchErrors from '../utils/catchErrors.js';

export const uploadPostImagesHandler = catchErrors(async (req, res) => {
  return res.status(200).json({
    success: true,
    message: 'Images uploaded successfully',
  });
});

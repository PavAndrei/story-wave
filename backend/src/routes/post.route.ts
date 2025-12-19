import {
  createPostHandler,
  getSinglePostHandler,
  editPostHandler,
  publishPostHandler,
  archivePostHandler,
  deletePostHandler,
  getMyDraftsHandler,
  getMyPostsHandler,
  getAllPostsHandler,
  createDraftPostHandler,
} from '../controllers/post.controller.js';
import { Router } from 'express';

const postRoutes = Router();

postRoutes.post('/draft', createDraftPostHandler);
postRoutes.post('/', createPostHandler);
postRoutes.patch('/:id', editPostHandler);
postRoutes.post('/:id/publish', publishPostHandler);
postRoutes.post('/:id/archive', archivePostHandler);
postRoutes.get('/my/drafts', getMyDraftsHandler);
postRoutes.get('/:id', getSinglePostHandler);
postRoutes.get('/my/published', getMyPostsHandler);
postRoutes.delete('/:id', deletePostHandler);
postRoutes.get('/', getAllPostsHandler);

export default postRoutes;

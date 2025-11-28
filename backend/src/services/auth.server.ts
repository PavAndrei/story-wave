// define params for a new user

export type createAccountParams = {
  username: string;
  email: string;
  password: string;
  avatarUrl?: string;
};

// creating a new user account service

export const createAccount = async (data: createAccountParams) => {
  // check if that user hasn't been created before
  // create a new user
  // verification code
  // send by email
  // session
  // tokens (access and refresh)
  // return user and tokens
};

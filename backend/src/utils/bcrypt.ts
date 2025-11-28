import bcrypt from 'bcrypt';

export const hashValue = async (value: string, saltRounds?: number) =>
  bcrypt.hash(value, saltRounds || 8);

export const compareValue = async (value: string, hashedValue: string) =>
  await bcrypt.compare(value, hashedValue).catch(() => false);

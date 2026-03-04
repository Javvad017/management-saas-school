import jwt from 'jsonwebtoken';

const generateToken = (id, role, schoolId) => {
  const payload = {
    id,
    role,
    schoolId
  };

  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

export default generateToken;

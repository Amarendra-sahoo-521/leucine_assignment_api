import { AppDataSource } from "../../config/database";
import { CreateEQDto } from "./user.dto";
import { Users } from "../../entities/user";
import bcrypt from "bcrypt";
import { AppError } from "../../utils/error";
import jwt from "jsonwebtoken";

export const userRepository = AppDataSource.getRepository(Users);
const ACCESS_SECRET = process.env.ACCESS_SECRET!;
const REFRESH_SECRET = process.env.REFRESH_SECRET!;

export const createNewUser = async (data: CreateEQDto) => {
    try {
        const user = await userRepository.findOneBy({ email: data.email })

        if (user) {
            throw new AppError("User Already Exists", 409);
        }

        const newRecord = userRepository.create(data)
        const hashedPassword = await bcrypt.hash(data.password, 10);
        const savedUser = await userRepository.save({ ...newRecord, password: hashedPassword });

        return {
            data: savedUser,
            message: `User created successfully`,
            status: true,
        };
    } catch (err: any) {
        throw err
    }
}


export const loginUserService = async (data: CreateEQDto) => {
    try {
        
        const user = await userRepository.findOneBy({ email: data.email })
        if (!user) {
            throw new AppError("User Not Found", 404);
        }
        const doMatched = await bcrypt.compare(data.password, user.password);
        if (!doMatched) {
            throw new AppError("Invalid Password", 401);
        }

        const accessToken = jwt.sign(
            {
                id: user.id,
                email: user.email,
            },
            ACCESS_SECRET,
            {
                expiresIn: "15m",
            }
        );

        const refreshToken = jwt.sign(
            {
                id: user.id,
            },
            REFRESH_SECRET,
            {
                expiresIn: "7d",
            }
        );

        return {
            data: { ...user, accessToken, },
            message: `User logged in successfully`,
            status: true,
            refreshToken: refreshToken
        };
    } catch (err: any) {
        throw err
    }
}

export const getUsers = async () => {
    try {
        const users = await userRepository.find();
        return {
            data: users,
            message: `Users retrieved successfully`,
            status: true,
        };
    } catch (err: any) {
        throw err
    }
}

export const refreshAccessToken = async (refreshToken: string) => {
  try {
    const decoded = jwt.verify(
      refreshToken,
      process.env.REFRESH_SECRET!
    ) as jwt.JwtPayload;

    const user = await userRepository.findOneBy({ id: decoded.id });
    if (!user) {
      throw new AppError("User not found", 404);
    }

    const accessToken = jwt.sign(
      {
        id: decoded.id,
        email: user.email
      },
      process.env.ACCESS_SECRET!,
      {
        expiresIn: "15m",
      }
    );

    return accessToken;
  } catch (error) {
    throw new AppError("Invalid or expired refresh token", 401);
  }
};

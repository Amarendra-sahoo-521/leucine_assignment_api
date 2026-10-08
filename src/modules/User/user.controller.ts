import { Request, Response } from "express";
import { createNewUser, getUsers, loginUserService, refreshAccessToken } from "./user.service";
import { CreateEQDto } from "./user.dto";
import { log } from "console";


export const getAllUsers = async (req: Request, res: Response) => {
    try {


        const result = await getUsers()

        res.status(200).json(result);
    } catch (error: any) {
        res.status(error.status).json({
            data: null,
            message: error.message,
            status: false,
        });
    }

}

export const createUser = async (req: Request, res: Response) => {
    try {

        const dto: CreateEQDto = req.body;

        const result = await createNewUser(dto);

        res.status(result.status ? 201 : 400).json(result);
    } catch (error: any) {

        res.status(error.statusCode).json({
            data: null,
            message: error.message,
            status: false,
        });
    }

}

export const loginUser = async (req: Request, res: Response) => {
    try {
        const dto: CreateEQDto = req.body;

        const { refreshToken, ...result } = await loginUserService(dto);
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
        });

        res.status(result.status ? 200 : 400).json(result);
    } catch (error: any) {
        res.status(error.statusCode).json({
            data: null,
            message: error.message,
            status: false,
        });
    }

}

export const refreshTokenController = async (
    req: Request,
    res: Response
) => {
    try {

        const refreshToken = req.cookies.refreshToken;

        if (!refreshToken) {
            return res.status(402).json({
                message: "Refresh token is required",
            });
        }

        const accessToken = await refreshAccessToken(refreshToken);

        return res.status(200).json({
            status: true,
            accessToken,
        });
    } catch (error: any) {
        console.log("err", error);

        res.status(error.statusCode).json({
            data: null,
            message: error.message,
            status: false,
        });
    }
};

export const logoutUserController = async (
  req: Request,
  res: Response
) => {
  try {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: false, // true in production HTTPS
      sameSite: "lax",
    });

    return res.status(200).json({
      status: true,
      message: "Logged out successfully",
    });
  } catch (error: any) {
    return res.status(error.statusCode || 500).json({
      status: false,
      message: error.message,
    });
  }
};
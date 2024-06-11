import { PrismaClient } from "@prisma/client";
import dayjs from "dayjs";

const prismaClient = new PrismaClient();

export namespace nclients {
    export async function list() {
        return await prismaClient.client.findMany({
            orderBy: {
                name: "asc"
            }
        });
    }

    export async function listWithSalesOrders() {
        return await prismaClient.client.findMany({
            include: {
                salesOrder: true
            }
        });
    }


    export async function listById(cId: string) {
        return await prismaClient.client.findFirst({
            where: {
                id: cId
            }
        });
    }

    export async function listByEmail(cEmail: string) {
        return await prismaClient.client.findFirst({
            where: {
                email: cEmail
            }
        });
    }

    export async function listByCpf(cCpf: string) {
        return await prismaClient.client.findFirst({
            where: {
                cpf: cCpf
            }
        });
    }

    export async function create(cName: string, cEmail: string, cCpf: string, cCity: string) {
        return await prismaClient.client.create({
            data: {
                name: cName,
                email: cEmail,
                cpf: cCpf,
                city: cCity
            }
        });
    }

    export async function deleteById(cId: string) {
        return await prismaClient.client.delete({
            where: {
                id: cId
            }
        });
    }

    export async function modify(cId: string, cName: string, cEmail: string, cCpf: string, cCity: string) {
        return await prismaClient.client.update({
            where: {
                id: cId
            },

            data: {
                name: cName,
                email: cEmail,
                cpf: cCpf,
                city: cCity
            }
        });
    }
}

export namespace user {
    export async function getUsers() {
        return await prismaClient.user.findMany({
            orderBy: {
                name: "asc"
            }
        });
    }

    export async function getUserById(userId: string) {
        return await prismaClient.user.findFirst({
            where: {
                id: userId
            }
        });
    }

    export async function getUserByEmail(userEmail: string) {
        return await prismaClient.user.findFirst({
            where: {
                email: userEmail
            }
        });
    }

    export async function getUserByCpf(userCpf: string) {
        return await prismaClient.user.findFirst({
            where: {
                cpf: userCpf
            }
        });
    }

    export async function createUser(userName: string, userEmail: string, userCpf: string, userCity: string) {
        return await prismaClient.user.create({
            data: {
                name: userName,
                email: userEmail,
                cpf: userCpf,
                city: userCity
            }
        });
    }

    export async function deleteUserById(userId: string) {
        return await prismaClient.user.delete({
            where: {
                id: userId
            }
        });
    }

    export async function modifyUserById(userId: string, userName: string, userEmail: string, userCpf: string, userCity: string) {
        return await prismaClient.user.update({
            where: {
                id: userId
            },

            data: {
                name: userName,
                email: userEmail,
                cpf: userCpf,
                city: userCity
            }
        });
    }
}

export namespace player {
    export async function getPlayers() {
        return await prismaClient.player.findMany();
    }

    export async function getPlayerById(playerId: string) {
        return await prismaClient.player.findFirstOrThrow({
            where: {
                id: playerId
            }
        })
    }

    export async function createPlayer(userUUId: string) {
        return await prismaClient.player.create({
            data: {
                userId: userUUId
            }
        });
    }

    // export async function deletePlayerById(pId: string) {
    //     return await prismaClient.player.delete({
    //         where: {
    //             id: pId
    //         }
    //     });
    // }
}

export namespace product {
    export async function getProducts() {
        return await prismaClient.product.findMany();
    }

    export async function getProductById(pId: string) {
        return await prismaClient.product.findFirst({
            where: {
                id: pId
            }
        });
    }

    export async function getProductByName(pName: string) {
        return await prismaClient.product.findFirst({
            where: {
                product_name: pName
            }
        });
    }

    export async function createProduct(pName: string, pGrope: string, pAmount: number, pPrice: number) {
        return await prismaClient.product.create({
            data: {
                product_name: pName,
                grope_name: pGrope,
                amount: pAmount,
                price_unit: pPrice
            }
        });
    }

    export async function deleteProductById(pId: string) {
        return await prismaClient.product.delete({
            where: {
                id: pId
            }
        });
    }

    export async function modifyProductById(pId: string, pName: string, pGrope: string, pAmount: number, pPrice: number) {
        return await prismaClient.product.update({
            where: {
                id: pId
            },

            data: {
                product_name: pName,
                grope_name: pGrope,
                amount: pAmount,
                price_unit: pPrice
            }
        });
    }
}

export namespace salesOrder {
    export async function getOrders() {
        return await prismaClient.salesOrder.findMany();
    }

    export async function getOrdersFiltered(diff: number) {
        return await prismaClient.salesOrder.findMany({
            where: {
                unitary_value: {
                    lt: diff
                }
            }
        });
    }

    export async function getOrderById(sid: string) {
        return await prismaClient.salesOrder.findFirst({
            where: {
                id: sid
            }
        });
    }

    export async function createOrder(date_of_issue: Date, amount: number, unitary_value: number, clientId: string, productId: string) {
        return await prismaClient.salesOrder.create({
            data: {
                date_of_issue: dayjs(date_of_issue).toDate(),
                amount: amount,
                unitary_value: unitary_value,
                clientId: clientId,
                productId: productId
            }
        })
    }

    export async function deleteById(sid: string) {
        return await prismaClient.salesOrder.delete({
            where: {
                id: sid
            }
        })
    }

    export async function modifyOrder(sid: string, date_of_issue: Date, amount: number, unitary_value: number, clientId: string, productId: string) {
        return await prismaClient.salesOrder.update({
            where: {
                id: sid,
            },
            data: {
                date_of_issue: dayjs(date_of_issue).toDate(),
                amount: amount,
                unitary_value: unitary_value,
                clientId: clientId,
                productId: productId
            }
        })
    }
}
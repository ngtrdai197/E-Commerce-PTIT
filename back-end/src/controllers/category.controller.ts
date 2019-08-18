import { inject } from "inversify";
import { TYPES, constants } from "../common";
import { ICategoryRepository } from "../IRepositories";
import { httpGet, controller, httpPost, httpPut, httpDelete } from "inversify-express-utils";
import { ICategory, IProduct } from "../entities";
import { Request, Response } from "express";
import { parser } from "../middleware";

@controller("/category")
export class Category {
    constructor(@inject(TYPES.ICategoryRepository) private categoryRespository: ICategoryRepository) { }
    /**
        * @api {get} /api/category Get list category information
        * @apiName FindCategory
        * @apiSampleRequest http://localhost:3000/api/category
        * @apiGroup Category
        * @apiSuccess {Object[]} products List product of category.
        * @apiSuccess {Boolean} products.isDeleted Delete status of the product.
        * @apiSuccess {String[]} products.images List image of the product.
        * @apiSuccess {String} products.createdAtDate  Product creation date.
        * @apiSuccess {String} products.productName  Name of the product.
        * @apiSuccess {String} products.category  Id of the Category.
        * @apiSuccess {String} products.currentPrice  Current price of the product.
        * @apiSuccess {String} [products.oldPrice]  Old price of the product.
        * @apiSuccess {String} products.description  Description of the product.
        * @apiSuccess {String} products.title  Title of the product.
        * @apiSuccess {String} products.sex  Sex of the product (0: male | 1: female).
        * @apiSuccess {String} products.textSlug  Text slug of the product.
        * @apiSuccess {Object[]} products.feedback  Feedback of the product.
        * @apiSuccess {String} products.feedback.createdAtDate  Feedback creation date.
        * @apiSuccess {String} products.feedback._id  Id of the feedback.
        * @apiSuccess {String} products.feedback.customer  Id of the Customer.
        * @apiSuccess {String} products.feedback.content  Content of the feedback about product.
        * @apiSuccess {String} categoryName  Name of the Category.
        * @apiSuccess {String} _id  ID of the Category.
        * @apiSuccess {String} id  ID of the Category.
        * @apiSuccessExample Success-Response:
        *   HTTP/1.1 200 OK
        *   [
        *        {
        *            "products": [
        *                {
        *                    "images": [
        *                        "products/1565263663135-ef0d6e6e-2a88-2100-67f0-00143f6b730a.jpg",
        *                        "products/1565263663139-742e8676-7898-2200-7dce-00143f6b7312.jpg",
        *                        "products/1565263663140-044c6aea-b2d6-2300-d35e-00143f6b731c.jpg"
        *                    ],
        *                    "isDeleted": false,
        *                    "createdAtDate": "2019-08-08T11:09:17.291Z",
        *                    "_id": "5d4c0720a5f4e73810057326",
        *                    "productName": "Kính",
        *                    "category": "5d4c0609a5f4e7381005731f",
        *                    "currentPrice": 320000,
        *                    "oldPrice": null,
        *                    "description": "Kính",
        *                    "title": "Kính",
        *                    "sex": 0,
        *                    "textSlug": "kinh",
        *                    "feedback": [
        *                        {
        *                            "createdAtDate": "2019-08-13T11:38:11.223Z",
        *                            "_id": "5d52a3f3f860c7309c11085a",
        *                            "customer": "5d404d8e2efb4a177fb1944a",
        *                            "content": "kinh rat dep"
        *                        }
        *                    ],
        *                    "__v": 0,
        *                    "id": "5d4c0720a5f4e73810057326"
        *                },
        *                {
        *                    "images": [
        *                        "products/1565445345025-non-son-chinh-hang22-600x600.jpg",
        *                        "products/1565445345036-non-son-chinh-hang28-600x600.jpg"
        *                    ],
        *                    "isDeleted": false,
        *                    "createdAtDate": "2019-08-10T12:35:28.999Z",
        *                    "_id": "5d4ecc698e6fa21368b83a72",
        *                    "productName": "Nón kết",
        *                    "category": "5d4c0609a5f4e7381005731f",
        *                    "currentPrice": 350000,
        *                    "oldPrice": null,
        *                    "description": "Chất liệu dù phối da- lưới cao cấp.  Phong cách trẻ trung, năng động.  ĐỐI TƯỢNG:           Nam và nữ.  VÒNG ĐẦU :           52 cm – 59 cm (Mức chuẩn: 55 cm – 57 cm).",
        *                    "title": "Nón kết MC122C-CM1",
        *                    "sex": 0,
        *                    "textSlug": "non-ket-mc122c-cm1",
        *                    "feedback": [
        *                        {
        *                            "createdAtDate": "2019-08-12T14:44:37.491Z",
        *                            "_id": "5d517cce423bd12ddcb287e5",
        *                            "customer": "5d23854f4b8ef2352e6b146a",
        *                            "content": "mũ đẹp quá"
        *                        },
        *                        {
        *                            "createdAtDate": "2019-08-13T10:29:46.131Z",
        *                            "_id": "5d5293675cc5b0196888c4fe",
        *                            "customer": "5d23854f4b8ef2352e6b146a",
        *                            "content": "haha"
        *                        },
        *                        {
        *                            "createdAtDate": "2019-08-16T11:30:44.452Z",
        *                            "_id": "5d5693e45ff903036b4f6faa",
        *                            "customer": "5d5681af86960171f4b08f94",
        *                            "content": "mu dep"
        *                        }
        *                    ],
        *                    "__v": 0,
        *                    "id": "5d4ecc698e6fa21368b83a72"
        *                }
        *            ],
        *            "_id": "5d4c0609a5f4e7381005731f",
        *            "categoryName": "Kính",
        *            "__v": 0,
        *            "id": "5d4c0609a5f4e7381005731f"
        *        },
        *        {
        *            "products": [
        *                {
        *                    "images": [
        *                        "products/1565265479842-f0cb7df6-44b4-0800-2770-00141015eb8d.jpg",
        *                        "products/1565265479843-d399045c-383b-0200-fdb1-00141015eaf6.jpg",
        *                        "products/1565265479844-b2f91dce-fdfe-0900-349a-00141015eba1.jpg",
        *                        "products/1565265479844-7af0d399-addd-0600-bf93-00141015eb5e.jpg"
        *                    ],
        *                    "isDeleted": false,
        *                    "createdAtDate": "2019-08-08T11:38:19.305Z",
        *                    "_id": "5d4c0e2c143cd13d05e28d5e",
        *                    "productName": "Vớ ngắn",
        *                    "category": "5d4c0e11143cd13d05e28d5d",
        *                    "currentPrice": 79000,
        *                    "oldPrice": 120000,
        *                    "description": "Vớ ngắn",
        *                    "title": "Vớ ngắn",
        *                    "sex": 0,
        *                    "textSlug": "vo-ngan",
        *                    "feedback": [],
        *                    "__v": 0,
        *                    "id": "5d4c0e2c143cd13d05e28d5e"
        *                }
        *            ],
        *            "_id": "5d4c0e11143cd13d05e28d5d",
        *            "categoryName": "Vớ",
        *            "__v": 0,
        *            "id": "5d4c0e11143cd13d05e28d5d"
        *        },
        *        {
        *            "products": [
        *                {
        *                    "images": [
        *                        "products/1566013993415-0036bc8b7623c62ce36a39d904e541e8.jpg",
        *                        "products/1566021528668-870d0c04ea62ba2b4c7e5312a508aa1f.jpg",
        *                        "products/1566021653627-a6170941fd32fbf9b37bc009c13c7725.jpg"
        *                    ],
        *                    "isDeleted": false,
        *                    "createdAtDate": "2019-08-17T03:40:09.852Z",
        *                    "_id": "5d577a1926471a178c2a46d2",
        *                    "productName": "Dép Nam",
        *                    "category": "5d5779d726471a178c2a46d1",
        *                    "currentPrice": 159000,
        *                    "oldPrice": 230000,
        *                    "description": "Kiểu dáng ulzzang Hàn Quốc thời trang, năng động  Chất liệu cao su tổng hợp, mềm, chống thấm nước nên rất thỏa mái, không ngại trời mưa nắng, có quai hậu có thể xoay lên phía trước  Rất dễ xỏ chân, tiện lợi, rất nhẹ nên thỏa mái đi cả ngày không lo mỏi hoặc đau chân  Có thể mix với nhiều trang phục khác nhau và cho nhiều dịp: đi chơi, shopping, đi học, đi dạo....",
        *                    "title": "Dép Sục Nam Đẹp Bền Tặng Kèm Sticker HAPU",
        *                    "sex": 0,
        *                    "textSlug": "dep-suc-nam-dep-ben-tang-kem-sticker-hapu",
        *                    "feedback": [],
        *                    "__v": 0,
        *                    "id": "5d577a1926471a178c2a46d2"
        *                },
        *                {
        *                    "images": [
        *                        "products/1566021941402-5b12d70216ff344e3cb76f575b7dd343.jpg",
        *                        "products/1566021941403-6fd885c00940feaeeccdfb3a9ff1d893.jpg",
        *                        "products/1566021941405-d7db902d9fdf678aff906f94d9ae4aed.jpg",
        *                        "products/1566022259979-9fad174918cc5ec600b4ca01e81edebf.jpg"
        *                    ],
        *                    "isDeleted": false,
        *                    "createdAtDate": "2019-08-17T05:56:09.871Z",
        *                    "_id": "5d57992e579ddc23e44e50b8",
        *                    "productName": "Dép Sục",
        *                    "category": "5d5779d726471a178c2a46d1",
        *                    "currentPrice": 145000,
        *                    "oldPrice": null,
        *                    "description": "Dép thời trang việt nam xuất khẩu.  Giày dép cá sấu đi học , đi chơi đều rất Cute.  Dép cao 2,5cm .  Dép cá sấu được thiết kế đặc biệt theo tiêu chuẩn y tế, rất tốt cho sự phát triển của xương bàn chân.  Cực nhẹ, cực thoải mái, mang cả ngày đều dễ chịu  Đặc biệt được tặng kèm 8\ufeffJibbitz/Sticker",
        *                    "title": "Dép Sục Cá Sấu Duet Đen đế Đỏ +8Jibbitz/Sticker",
        *                    "sex": 1,
        *                    "textSlug": "dep-suc-ca-sau-duet-den-de-do-8jibbitzsticker",
        *                    "feedback": [],
        *                    "__v": 0,
        *                    "id": "5d57992e579ddc23e44e50b8"
        *                },
        *                {
        *                    "images": [
        *                        "products/1566022431421-39e05752b57df86a61c5a234b7545f91.jpg",
        *                        "products/1566022431422-4493c5de01cb01436c1c4a091918e189.jpg",
        *                        "products/1566022431423-06761f850b946010be8c1463de4ea298.jpg"
        *                    ],
        *                    "isDeleted": false,
        *                    "createdAtDate": "2019-08-17T05:56:09.871Z",
        *                    "_id": "5d579ada579ddc23e44e50b9",
        *                    "productName": "Dép Sục",
        *                    "category": "5d5779d726471a178c2a46d1",
        *                    "currentPrice": 160000,
        *                    "oldPrice": null,
        *                    "description": "Dép thời trang việt nam xuất khẩu.  Giày dép cá sấu đi học , đi chơi đều rất Cute.  Dép cao 2,5cm .  Dép cá sấu được thiết kế đặc biệt theo tiêu chuẩn y tế, rất tốt cho sự phát triển của xương bàn chân.  Cực nhẹ, cực thoải mái, mang cả ngày đều dễ chịu  Đặc biệt được tặng kèm 6Jibbitz/Sticker",
        *                    "title": "Dép Sục Cá Sấu Band Xanh Min kèm 6Jibbitz/Sticker",
        *                    "sex": 1,
        *                    "textSlug": "dep-suc-ca-sau-band-xanh-min-kem-6jibbitzsticker",
        *                    "feedback": [],
        *                    "__v": 0,
        *                    "id": "5d579ada579ddc23e44e50b9"
        *                }
        *            ],
        *            "_id": "5d5779d726471a178c2a46d1",
        *            "categoryName": "Dép",
        *            "__v": 0,
        *            "id": "5d5779d726471a178c2a46d1"
        *        }
        *    ]
        *
    */
    @httpGet("/")
    public async findAll(): Promise<ICategory[]> {
        try {
            return await this.categoryRespository.findAll();
        } catch (error) {
            throw error;
        }
    }

    /**
        * @api {get} /api/category/find/:id Get category information
        * @apiHeader {String} x-access-token Tokens review user permissions.
        * @apiParam {String} id Category unique ID.
        * @apiName FindCategoryByID
        * @apiGroup Category
        * @apiSampleRequest http://localhost:3000/api/category/find/
        * @apiParamExample {json} Request-Example:
        *     {
        *       "id": "5d4c0e11143cd13d05e28d5d"
        *     }
        * @apiSuccess {Object[]} products List product of category.
        * @apiSuccess {Boolean} products.isDeleted Delete status of the product.
        * @apiSuccess {String[]} products.images List image of the product.
        * @apiSuccess {String} products.createdAtDate  Product creation date.
        * @apiSuccess {String} products.productName  Name of the product.
        * @apiSuccess {String} products.category  Id of the Category.
        * @apiSuccess {String} products.currentPrice  Current price of the product.
        * @apiSuccess {String} [products.oldPrice]  Old price of the product.
        * @apiSuccess {String} products.description  Description of the product.
        * @apiSuccess {String} products.title  Title of the product.
        * @apiSuccess {String} products.sex  Sex of the product (0: male | 1: female).
        * @apiSuccess {String} products.textSlug  Text slug of the product.
        * @apiSuccess {Object[]} products.feedback  Feedback of the product.
        * @apiSuccess {String} products.feedback.createdAtDate  Feedback creation date.
        * @apiSuccess {String} products.feedback._id  Id of the feedback.
        * @apiSuccess {String} products.feedback.customer  Id of the Customer.
        * @apiSuccess {String} products.feedback.content  Content of the feedback about product.
        * @apiSuccess {String} categoryName  Name of the Category.
        * @apiSuccess {String} _id  ID of the Category.
        * @apiSuccess {String} id  ID of the Category.
        * @apiSuccessExample Success-Response:
        *   HTTP/1.1 200 OK
        *   [
        *        {
        *            "products": [
        *                {
        *                    "images": [
        *                        "products/1566013993415-0036bc8b7623c62ce36a39d904e541e8.jpg",
        *                        "products/1566021528668-870d0c04ea62ba2b4c7e5312a508aa1f.jpg",
        *                        "products/1566021653627-a6170941fd32fbf9b37bc009c13c7725.jpg"
        *                    ],
        *                    "isDeleted": false,
        *                    "createdAtDate": "2019-08-17T03:40:09.852Z",
        *                    "_id": "5d577a1926471a178c2a46d2",
        *                    "productName": "Dép Nam",
        *                    "category": "5d5779d726471a178c2a46d1",
        *                    "currentPrice": 159000,
        *                    "oldPrice": 230000,
        *                    "description": "Kiểu dáng ulzzang Hàn Quốc thời trang, năng động  Chất liệu cao su tổng hợp, mềm, chống thấm nước nên rất thỏa mái, không ngại trời mưa nắng, có quai hậu có thể xoay lên phía trước  Rất dễ xỏ chân, tiện lợi, rất nhẹ nên thỏa mái đi cả ngày không lo mỏi hoặc đau chân  Có thể mix với nhiều trang phục khác nhau và cho nhiều dịp: đi chơi, shopping, đi học, đi dạo....",
        *                    "title": "Dép Sục Nam Đẹp Bền Tặng Kèm Sticker HAPU",
        *                    "sex": 0,
        *                    "textSlug": "dep-suc-nam-dep-ben-tang-kem-sticker-hapu",
        *                    "feedback": [],
        *                    "__v": 0,
        *                    "id": "5d577a1926471a178c2a46d2"
        *                },
        *                {
        *                    "images": [
        *                        "products/1566021941402-5b12d70216ff344e3cb76f575b7dd343.jpg",
        *                        "products/1566021941403-6fd885c00940feaeeccdfb3a9ff1d893.jpg",
        *                        "products/1566021941405-d7db902d9fdf678aff906f94d9ae4aed.jpg",
        *                        "products/1566022259979-9fad174918cc5ec600b4ca01e81edebf.jpg"
        *                    ],
        *                    "isDeleted": false,
        *                    "createdAtDate": "2019-08-17T05:56:09.871Z",
        *                    "_id": "5d57992e579ddc23e44e50b8",
        *                    "productName": "Dép Sục",
        *                    "category": "5d5779d726471a178c2a46d1",
        *                    "currentPrice": 145000,
        *                    "oldPrice": null,
        *                    "description": "Dép thời trang việt nam xuất khẩu.  Giày dép cá sấu đi học , đi chơi đều rất Cute.  Dép cao 2,5cm .  Dép cá sấu được thiết kế đặc biệt theo tiêu chuẩn y tế, rất tốt cho sự phát triển của xương bàn chân.  Cực nhẹ, cực thoải mái, mang cả ngày đều dễ chịu  Đặc biệt được tặng kèm 8\ufeffJibbitz/Sticker",
        *                    "title": "Dép Sục Cá Sấu Duet Đen đế Đỏ +8Jibbitz/Sticker",
        *                    "sex": 1,
        *                    "textSlug": "dep-suc-ca-sau-duet-den-de-do-8jibbitzsticker",
        *                    "feedback": [],
        *                    "__v": 0,
        *                    "id": "5d57992e579ddc23e44e50b8"
        *                },
        *                {
        *                    "images": [
        *                        "products/1566022431421-39e05752b57df86a61c5a234b7545f91.jpg",
        *                        "products/1566022431422-4493c5de01cb01436c1c4a091918e189.jpg",
        *                        "products/1566022431423-06761f850b946010be8c1463de4ea298.jpg"
        *                    ],
        *                    "isDeleted": false,
        *                    "createdAtDate": "2019-08-17T05:56:09.871Z",
        *                    "_id": "5d579ada579ddc23e44e50b9",
        *                    "productName": "Dép Sục",
        *                    "category": "5d5779d726471a178c2a46d1",
        *                    "currentPrice": 160000,
        *                    "oldPrice": null,
        *                    "description": "Dép thời trang việt nam xuất khẩu.  Giày dép cá sấu đi học , đi chơi đều rất Cute.  Dép cao 2,5cm .  Dép cá sấu được thiết kế đặc biệt theo tiêu chuẩn y tế, rất tốt cho sự phát triển của xương bàn chân.  Cực nhẹ, cực thoải mái, mang cả ngày đều dễ chịu  Đặc biệt được tặng kèm 6Jibbitz/Sticker",
        *                    "title": "Dép Sục Cá Sấu Band Xanh Min kèm 6Jibbitz/Sticker",
        *                    "sex": 1,
        *                    "textSlug": "dep-suc-ca-sau-band-xanh-min-kem-6jibbitzsticker",
        *                    "feedback": [],
        *                    "__v": 0,
        *                    "id": "5d579ada579ddc23e44e50b9"
        *                }
        *            ],
        *            "_id": "5d5779d726471a178c2a46d1",
        *            "categoryName": "Dép",
        *            "__v": 0,
        *            "id": "5d5779d726471a178c2a46d1"
        *        }
        *
        * @apiError UnAuthorization Token invalid.
        *
        * @apiErrorExample Error-Response:
        *     HTTP/1.1 401 UnAuthorization
        *     {
        *       "statusCode": 401,
        *       "message": "UnAuthorization" 
        *     }
    */
    @httpGet('/find/:id', parser([constants.ROLES.ADMIN, constants.ROLES.USER]))
    public async findOne(req: Request): Promise<ICategory> {
        try {
            const result = await this.categoryRespository.findOnePopulate({ _id: req.params.id });
            return Promise.resolve(result);
        } catch (error) {
            throw error;
        }
    }
    /**
        * @api {post} /api/category Create a category
        * @apiHeader {String} x-access-token Tokens review user permissions.
        * @apiPermission Admin
        * @apiName CreateCategory
        * @apiGroup Category 
        * @apiSampleRequest http://localhost:3000/api/category
        * @apiParam {String} categoryName  Name of the category.
        * 
        * @apiParamExample {json} Request-Example:
        *  {
        *        "products": [],
        *        "_id": "5d57d90a896c892598f689ce",
        *        "categoryName": "Balo",
        *        "__v": 0,
        *        "id": "5d57d90a896c892598f689ce"
        *    }
        *
        * @apiSuccess {Object[]} products List product of category.
        * @apiSuccess {String} categoryName  Name of the category.
        * @apiSuccess {String} id  ID of the Category.
        * @apiSuccess {String} _id  ID of the Category.
        * 
        *
        * @apiSuccessExample Success-Response:
        *     HTTP/1.1 200 OK
        *       {
        *            "products": [],
        *            "_id": "5d57d90a896c892598f689ce",
        *            "categoryName": "Balo",
        *            "__v": 0,
        *            "id": "5d57d90a896c892598f689ce"
        *        }
        *
        * @apiError NotPermission You have not permission.
        * @apiError NotAuthorization Token invalid.
        * 
        *
        * @apiErrorExample Error-Response:
        *     HTTP/1.1 403 NotPermission
        *     {
        *       "statusCode": 403,
        *       "message": "NotPermission" 
        *     }
        *     HTTP/1.2 401 NotAuthorization
        *     {
        *       "statusCode": 401,
        *       "message": "NotAuthorization" 
        *     }
    */
    @httpPost("/", parser([constants.ROLES.ADMIN]))
    public async create(req: Request): Promise<ICategory> {
        try {
            const { body } = req;
            return await this.categoryRespository.create(body);
        } catch (error) {
            throw error;
        }
    }

    /**
        * @api {put} /api/category Update a category
        * @apiHeader {String} x-access-token Tokens review user permissions.
        * @apiPermission Admin
        * @apiName UpdateCategory
        * @apiGroup Category 
        * @apiSampleRequest http://localhost:3000/api/category
        * @apiParam {String} categoryName  Name of the category.
        * @apiParam {String} id  ID of the Category.
        * @apiParam {String} _id  ID of the Category.
        * 
        * @apiParamExample {json} Request-Example:
        *  {
        *        "_id": "5d57d90a896c892598f689ce",
        *        "categoryName": "Balo & Túi sách",
        *        "id": "5d57d90a896c892598f689ce"
        *    }
        *
        * @apiSuccess {Object[]} products List product of category.
        * @apiSuccess {String} categoryName  Name of the category.
        * @apiSuccess {String} id  ID of the Category.
        * @apiSuccess {String} _id  ID of the Category.
        * 
        *
        * @apiSuccessExample Success-Response:
        *     HTTP/1.1 200 OK
        *      {
        *        "products": [],
        *        "_id": "5d57d90a896c892598f689ce",
        *        "categoryName": "Balo & Túi sách",
        *        "__v": 0,
        *        "id": "5d57d90a896c892598f689ce"
        *      }
        * 
        * @apiError NotPermission You have not permission.
        * @apiError NotAuthorization Token invalid.
        * 
        *
        * @apiErrorExample Error-Response:
        *     HTTP/1.1 403 NotAuthorization
        *     {
        *       "statusCode": 403,
        *       "message": "NotPermission" 
        *     }
        *     HTTP/1.2 401 NotAuthorization
        *     {
        *       "statusCode": 401,
        *       "message": "NotAuthorization" 
        *     }
     */
    @httpPut("/", parser([constants.ROLES.ADMIN]))
    public async update(req: Request): Promise<ICategory> {
        try {
            const { body } = req;
            return await this.categoryRespository.update(body);
        } catch (error) {
            throw error;
        }
    }

    /**
        * @api {delete} /api/category/:id Remove a category
        * @apiHeader {String} x-access-token Tokens review user permissions.
        * @apiPermission Admin
        * @apiGroup Category
        * @apiParam {String} id Category unique ID.
        * @apiName RemoveCategoryByID
        * @apiSampleRequest http://localhost:3000/api/category/
        * @apiParamExample {json} Request-Example:
        *     {
        *       "id": "5d4c0e11143cd13d05e28d5d"
        *     }
        * @apiSuccess {Boolean} isDeleted  whether the category state has been deleted or not.
        * @apiSuccess {String} message Notify for action delete.
        * 
        * @apiSuccessExample Success-Response:
        *   HTTP/1.1 200 OK
        *     {
        *        "isDeleted": true,
        *        "message": "Successfully deleted category with id: 5d57d90a896c892598f689ce"
        *     }
        * @apiError NotPermission You have not permission.
        * @apiError NotAuthorization Token invalid.
        * @apiError CastObjectIdFailed to ObjectId failed for value id.
        * @apiError BadRequest Danh mục hiện đang chứa sản phẩm. Nên không thể xóa.
        * 
        *
        * @apiErrorExample Error-Response:
        *     HTTP/1.1 403 NotPermission
        *     {
        *       "statusCode": 403,
        *       "message": "NotPermission" 
        *     }
        *     HTTP/1.2 400 BadRequest
        *     {
        *       "statusCode": 400,
        *       "message": "BadRequest" 
        *     }
        *     HTTP/1.3 401 NotAuthorization
        *     {
        *       "statusCode": 401,
        *       "message": "NotAuthorization" 
        *     }
        *     HTTP/1.4 500 Server Error
        *     {
        *       "error": "CastObjectIdFailed"
        *     }
    */
    @httpDelete("/:id", parser([constants.ROLES.ADMIN]))
    public async delete(req: Request, res: Response): Promise<any> {
        try {
            const { id } = req.params;
            const category = await this.categoryRespository.findOne({ _id: id });
            if ((category.products as IProduct[]).length > 0) {
                return res.status(400).send('Danh mục hiện đang chứa sản phẩm. Nên không thể xóa');
            }
            return await this.categoryRespository.delete(id);
        } catch (error) {
            return res.status(500).send(error);
        }
    }

    /**
        * @api {get} /api/category/query Get list category information (not have populate products)
        * @apiHeader {String} x-access-token Tokens review user permissions.
        * @apiName QueryCategory
        * @apiPermission Admin
        * @apiGroup Category
        * 
        * @apiSampleRequest http://localhost:3000/api/category/query
        * @apiSuccess {Object[]} products List product ID of category.
        * @apiSuccess {String} categoryName  Name of the Category.
        * @apiSuccess {String} _id  ID of the Category.
        * @apiSuccess {String} id  ID of the Category.
        * @apiSuccessExample Success-Response:
        *   HTTP/1.1 200 OK
        *   [
        *        {
        *            "products": [
        *                "5d4d01510d5fa82fcc3cbd47",
        *                "5d4d235d60fbc31e0815d03a"
        *            ],
        *            "_id": "5d4cfbe6c7473c2660edf4a2",
        *            "categoryName": "Nón",
        *            "__v": 0,
        *            "id": "5d4cfbe6c7473c2660edf4a2"
        *        },
        *        {
        *            "products": [
        *                "5d577a1926471a178c2a46d2",
        *                "5d57992e579ddc23e44e50b8",
        *                "5d579ada579ddc23e44e50b9"
        *            ],
        *            "_id": "5d5779d726471a178c2a46d1",
        *            "categoryName": "Dép",
        *            "__v": 0,
        *            "id": "5d5779d726471a178c2a46d1"
        *        }
        *   ]
        *
        * @apiError NotPermission You have not permission.
        * @apiError NotAuthorization Token invalid.
        *
        * @apiErrorExample Error-Response:
        *     HTTP/1.1 401 UnAuthorization
        *     {
        *       "statusCode": 401,
        *       "message": "UnAuthorization" 
        *     }
        *     HTTP/1.2 403 NotPermission
        *     {
        *       "statusCode": 403,
        *       "message": "NotPermission" 
        *     }
    */
    @httpGet("/query", parser([constants.ROLES.ADMIN]))
    public async categoryTypes(req: Request, res: Response): Promise<any> {
        try {
            const data = await this.categoryRespository.findAllCategoryName();
            if (!data) return res.status(404).json({ statusCode: 404, message: 'Danh mục sản phẩm không tồn tại' });
            return res.status(200).send(data);
        } catch (error) {
            throw error;
        }
    }
}

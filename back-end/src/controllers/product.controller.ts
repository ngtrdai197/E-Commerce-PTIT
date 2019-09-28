import {
  controller,
  httpGet,
  httpPost,
  httpDelete,
  httpPut,
  requestParam
} from "inversify-express-utils";
import { IProduct, IFeedback } from "../entities";
import { inject } from "inversify";
import { TYPES, constants } from "../common";
import {
  IProductRepository,
  ICategoryRepository,
  IOrderRepository
} from "../IRepositories";
import { Request, Response } from "express";
import { upload } from "../multer";
import { unlink } from "fs";
import { parser } from "../middleware";
import { toSlug } from "../common/slug";
import { cache } from "../redis";
import { createClient } from "redis";

@controller("/product")
export class Product {
  constructor(
    @inject(TYPES.IProductRepository) private productRepo: IProductRepository,
    @inject(TYPES.ICategoryRepository)
    private categoryRepo: ICategoryRepository,
    @inject(TYPES.IOrderRepository) private orderRepo: IOrderRepository
  ) {}

  /**
   * @api {get} /api/product Find all products and paging
   * @apiHeader {String} x-access-token Tokens review user permissions.
   * @apiSampleRequest http://localhost:3000/api/product
   * @apiParam {Number} page Page to product.
   * @apiParam {Number} perPage Number of products you want to display.
   * @apiParamExample Request-Example:
   * ?page=1&perPage=10
   * @apiName FindAllProduct
   * @apiGroup Product
   *
   * @apiSuccess {Boolean} isDeleted Delete status of the product.
   * @apiSuccess {String[]} images List image of the product.
   * @apiSuccess {String} createdAtDate  Product creation date.
   * @apiSuccess {String} productName  Name of the product.
   * @apiSuccess {String} category  Id of the Category.
   * @apiSuccess {String} currentPrice  Current price of the product.
   * @apiSuccess {String} [oldPrice]  Old price of the product.
   * @apiSuccess {String} description  Description of the product.
   * @apiSuccess {String} title  Title of the product.
   * @apiSuccess {String} sex  Sex of the product (0: male | 1: female).
   * @apiSuccess {String} textSlug  Text slug of the product.
   * @apiSuccess {Object[]} feedback  Feedback of the product.
   * @apiSuccess {String} feedback.createdAtDate  Feedback creation date.
   * @apiSuccess {String} feedback._id  Id of the feedback.
   * @apiSuccess {String} feedback.customer  Id of the Customer.
   * @apiSuccess {String} feedback.content  Content of the feedback about product.
   * @apiSuccessExample Success-Response:
   *     HTTP/1.1 200 OK
   *    {
   *      "products": [
   *       {
   *           "images": [
   *               "products/1565263457638-68th19s0192_-_copy.jpg",
   *               "products/1565263457639-8th19s042-cb173-37_-_copy.jpg",
   *               "products/1565263457639-8th19s040-pr070-m_2.jpg"
   *           ],
   *           "isDeleted": false,
   *           "createdAtDate": "2019-08-08T11:09:17.291Z",
   *           "_id": "5d4c0657a5f4e73810057321",
   *           "productName": "Áo sơ mi",
   *           "category": "5d4c0605a5f4e7381005731e",
   *           "currentPrice": 199000,
   *           "oldPrice": null,
   *           "description": "Áo sơ mi",
   *           "title": "Áo sơ mi",
   *           "sex": 0,
   *           "textSlug": "ao-so-mi",
   *           "feedback": [],
   *           "__v": 0,
   *           "id": "5d4c0657a5f4e73810057321"
   *       },
   *       {
   *           "images": [
   *               "products/1565263485156-8th19s039-cb165-33_thumb.jpg",
   *               "products/1565263485158-8th19s037-cb164-xl-2.jpg",
   *               "products/1565263485159-8th19s028-pb232-33_thumb.jpg"
   *           ],
   *           "isDeleted": false,
   *           "createdAtDate": "2019-08-08T11:09:17.291Z",
   *           "_id": "5d4c066ca5f4e73810057322",
   *           "productName": "Áo sơ mi",
   *           "category": "5d4c0605a5f4e7381005731e",
   *           "currentPrice": 210000,
   *           "oldPrice": null,
   *           "description": "Áo sơ mi",
   *           "title": "Áo sơ mi",
   *           "sex": 0,
   *           "textSlug": "ao-so-mi",
   *           "feedback": [],
   *           "__v": 0,
   *           "id": "5d4c066ca5f4e73810057322"
   *       },
   *       {
   *           "images": [
   *               "products/1565263589526-8th19s037-cb164-xl-2.jpg",
   *               "products/1565263589528-8th19s028-pb232-33_thumb.jpg",
   *               "products/1565263589532-8th19s013-sw001-l_2.jpg"
   *           ],
   *           "isDeleted": false,
   *           "createdAtDate": "2019-08-08T11:09:17.291Z",
   *           "_id": "5d4c06bda5f4e73810057324",
   *           "productName": "Áo sơ mi",
   *           "category": "5d4c0605a5f4e7381005731e",
   *           "currentPrice": 212000,
   *           "oldPrice": null,
   *           "description": "Áo sơ mi",
   *           "title": "Áo sơ mi",
   *           "sex": 0,
   *           "textSlug": "ao-so-mi",
   *           "feedback": [],
   *           "__v": 0,
   *           "id": "5d4c06bda5f4e73810057324"
   *       },
   *       {
   *           "images": [
   *               "products/1565263535522-8th18w012-sk090-33_2.jpg",
   *               "products/1565263535525-8th18w005-db039-m_2.jpg",
   *               "products/1565263535526-8e8754ef-7b20-2400-4d35-0015906167b9.jpg"
   *           ],
   *           "isDeleted": false,
   *           "createdAtDate": "2019-08-08T11:09:17.291Z",
   *           "_id": "5d4c0691a5f4e73810057323",
   *           "productName": "Áo sơ mi",
   *           "category": "5d4c0605a5f4e7381005731e",
   *           "currentPrice": 230000,
   *           "oldPrice": 243000,
   *           "description": "Áo sơ mi",
   *           "title": "Áo sơ mi",
   *           "sex": 0,
   *           "textSlug": "ao-so-mi",
   *           "feedback": [],
   *           "__v": 0,
   *           "id": "5d4c0691a5f4e73810057323"
   *       },
   *       {
   *           "images": [
   *               "products/1565263436271-ad5413a7-8bc7-b500-8d28-0014f1c13541.jpg",
   *               "products/1565263436275-a0a00c64-1237-6d00-067f-0015b64eee78.jpg",
   *               "products/1565263436277-93ed08bd-8ce6-0700-1f9f-00155fab9f4a.jpg"
   *           ],
   *           "isDeleted": false,
   *           "createdAtDate": "2019-08-08T11:09:17.291Z",
   *           "_id": "5d4c062da5f4e73810057320",
   *           "productName": "Áo sơ mi",
   *           "category": "5d4c0605a5f4e7381005731e",
   *           "currentPrice": 234000,
   *           "oldPrice": 250000,
   *           "description": "Áo sơ mi",
   *           "title": "Áo sơ mi",
   *           "sex": 0,
   *           "textSlug": "ao-so-mi",
   *           "feedback": [],
   *           "__v": 0,
   *           "id": "5d4c062da5f4e73810057320"
   *       },
   *       {
   *           "images": [
   *               "products/1565263627761-8th19s004-fw128-33_thumb.jpg",
   *               "products/1565263627762-8th18s009-se153-33_-_copy.jpg",
   *               "products/1565263627762-8th18s008-sb422-33_-_copy.jpg",
   *               "products/1565263627762-8th18c012-sb494-33-.jpg"
   *           ],
   *           "isDeleted": false,
   *           "createdAtDate": "2019-08-08T11:09:17.291Z",
   *           "_id": "5d4c06f0a5f4e73810057325",
   *           "productName": "Áo sơ mi",
   *           "category": "5d4c0605a5f4e7381005731e",
   *           "currentPrice": 250000,
   *           "oldPrice": null,
   *           "description": "Áo sơ mi",
   *           "title": "Áo sơ mi",
   *           "sex": 0,
   *           "textSlug": "ao-so-mi",
   *           "feedback": [],
   *           "__v": 0,
   *           "id": "5d4c06f0a5f4e73810057325"
   *       }
   *      ],
   *       "current": 1,
   *       "total": 6,
   *       "pages": 1
   *   }
   */
  @httpGet("/", cache())
  public async findAll(req: Request, res: Response): Promise<IProduct[] | any> {
    try {
      const query = {
        page: +req.query.page,
        perPage: +req.query.perPage,
        isDeleted: false
      };

      const products = await this.productRepo.findAll(query);
      createClient().setex(`${req.url}`, 3600, JSON.stringify(products));
      return products;
    } catch (error) {
      throw error;
    }
  }

  // remove file within disk
  @httpPost("/unlink")
  public async unLink(req: Request, res: Response): Promise<any> {
    try {
      const { body } = req;
      const product = await this.productRepo.findOne({ _id: body.productId });
      if (product) {
        (product.images as []).map(async (x, index) => {
          if (await (body.linkImage as string).includes(x)) {
            await (product.images as []).splice(index, 1);
            await unlink(`src/public/${x}`, error => {
              if (error) {
                throw error;
              }
            });
            await this.productRepo.update(product);
          }
        });
        return res
          .status(200)
          .send({ isDeleted: true, message: "Xóa hình ảnh thành công" });
      }
      return res.status(400).send({
        isDeleted: false,
        message: "Không tìm thấy sản phẩm để cập nhật"
      });
    } catch (error) {
      throw error;
    }
  }
  /**
   * @api {get} /api/product/:id Find all products and paging
   * @apiHeader {String} x-access-token Tokens review user permissions.
   * @apiSampleRequest http://localhost:3000/api/product
   * @apiParam {String} id ID of the product.
   * @apiParamExample {json} Request-Example:
   * {
   *      "id":"5d4c0657a5f4e73810057321"
   * }
   * @apiName FindProductByID
   * @apiGroup Product
   *
   * @apiSuccess {Boolean} isDeleted Delete status of the product.
   * @apiSuccess {String[]} images List image of the product.
   * @apiSuccess {String} createdAtDate  Product creation date.
   * @apiSuccess {String} productName  Name of the product.
   * @apiSuccess {String} category  Id of the Category.
   * @apiSuccess {String} currentPrice  Current price of the product.
   * @apiSuccess {String} [oldPrice]  Old price of the product.
   * @apiSuccess {String} description  Description of the product.
   * @apiSuccess {String} title  Title of the product.
   * @apiSuccess {String} sex  Sex of the product (0: male | 1: female).
   * @apiSuccess {String} textSlug  Text slug of the product.
   * @apiSuccess {Object[]} feedback  Feedback of the product.
   * @apiSuccess {String} feedback.createdAtDate  Feedback creation date.
   * @apiSuccess {String} feedback._id  Id of the feedback.
   * @apiSuccess {String} feedback.customer  Id of the Customer.
   * @apiSuccess {String} feedback.content  Content of the feedback about product.
   * @apiSuccessExample Success-Response:
   *     HTTP/1.1 200 OK
   *       {
   *           "images": [
   *               "products/1565263457638-68th19s0192_-_copy.jpg",
   *               "products/1565263457639-8th19s042-cb173-37_-_copy.jpg",
   *               "products/1565263457639-8th19s040-pr070-m_2.jpg"
   *           ],
   *           "isDeleted": false,
   *           "createdAtDate": "2019-08-08T11:09:17.291Z",
   *           "_id": "5d4c0657a5f4e73810057321",
   *           "productName": "Áo sơ mi",
   *           "category": "5d4c0605a5f4e7381005731e",
   *           "currentPrice": 199000,
   *           "oldPrice": null,
   *           "description": "Áo sơ mi",
   *           "title": "Áo sơ mi",
   *           "sex": 0,
   *           "textSlug": "ao-so-mi",
   *           "feedback": [],
   *           "__v": 0,
   *           "id": "5d4c0657a5f4e73810057321"
   *       }
   */
  @httpGet("/:id")
  public async findOne(@requestParam("id") id: string) {
    return await this.productRepo.findOne({ _id: id });
  }

  // ???? không dùng tới nữa
  @httpGet("/category/:id")
  public async findByCategory(@requestParam("id") id: string, res: Response) {
    try {
      const products = await this.productRepo.findAll({
        category: id,
        isDeleted: false
      });
      return products;
    } catch (error) {
      return res.status(500).json({ statusCode: 500, message: error.message });
    }
  }

  /**
   * @api {post} /api/product Create a product
   * @apiHeader {String} x-access-token Tokens review user permissions.
   * @apiPermission Admin
   * @apiSampleRequest http://localhost:3000/api/product
   * @apiSuccess {String} productName  Name of the product.
   * @apiSuccess {String} category  Id of the Category.
   * @apiSuccess {String} currentPrice  Current price of the product.
   * @apiSuccess {String} [oldPrice]  Old price of the product.
   * @apiSuccess {String} description  Description of the product.
   * @apiSuccess {String} title  Title of the product.
   * @apiSuccess {String} sex  Sex of the product (0: male | 1: female).
   * @apiSuccess {String} textSlug  Text slug of the product.
   * @apiParamExample {json} Request-Example:
   * {
   *   "isDeleted": false,
   *   "productName": "Nón lưỡi trai",
   *   "category": "5d4c0609a5f4e7381005731f",
   *   "currentPrice": 290000,
   *   "oldPrice": null,
   *   "description": "Chất liệu dù phối da- lưới cao cấp.  Phong cách trẻ trung, năng động.  ĐỐI TƯỢNG:Nam và nữ.  VÒNG ĐẦU :52 cm – 59 cm (Mức chuẩn: 55 cm – 57 cm).",
   *   "title": "Nón lưỡi trai MC122C-CM1",
   *   "sex": 0,
   *   "textSlug": "non-luoi-trai-mc122c-cm1"
   * }
   * @apiName CreateProduct
   * @apiGroup Product
   *
   * @apiSuccess {Boolean} isDeleted Delete status of the product.
   * @apiSuccess {String[]} images List image of the product.
   * @apiSuccess {String} createdAtDate  Product creation date.
   * @apiSuccess {String} productName  Name of the product.
   * @apiSuccess {String} category  Id of the Category.
   * @apiSuccess {String} currentPrice  Current price of the product.
   * @apiSuccess {String} [oldPrice]  Old price of the product.
   * @apiSuccess {String} description  Description of the product.
   * @apiSuccess {String} title  Title of the product.
   * @apiSuccess {String} sex  Sex of the product (0: male | 1: female).
   * @apiSuccess {String} textSlug  Text slug of the product.
   * @apiSuccess {Object[]} feedback  Feedback of the product.
   * @apiSuccess {String} feedback.createdAtDate  Feedback creation date.
   * @apiSuccess {String} feedback._id  Id of the feedback.
   * @apiSuccess {String} feedback.customer  Id of the Customer.
   * @apiSuccess {String} feedback.content  Content of the feedback about product.
   * @apiSuccessExample Success-Response:
   *     HTTP/1.1 200 OK
   *       {
   *           "images": [],
   *           "isDeleted": false,
   *           "createdAtDate": "2019-08-17T12:33:08.045Z",
   *           "_id": "5d57f56f91b8bb2478b03b4f",
   *           "productName": "Nón lưỡi trai",
   *           "category": "5d4c0609a5f4e7381005731f",
   *           "currentPrice": 199000,
   *           "oldPrice": null,
   *           "description": "Chất liệu dù phối da- lưới cao cấp.  Phong cách trẻ trung, năng động.  ĐỐI TƯỢNG:           Nam và nữ.  VÒNG ĐẦU :           52 cm – 59 cm (Mức chuẩn: 55 cm – 57 cm).",
   *           "title": "Nón lưỡi trai MC122C-CM1",
   *           "sex": 0,
   *           "textSlug": "ao-so-mi",
   *           "feedback": [],
   *           "__v": 0,
   *           "id": "5d57f56f91b8bb2478b03b4f"
   *       }
   */

  @httpPost("/", parser([constants.ROLES.ADMIN]))
  public async create(req: Request): Promise<IProduct> {
    try {
      const { body } = req;
      body.sex = +body.sex; // if sex is string => parse to number
      const p: IProduct = body;
      p.textSlug = toSlug(p.title as string);
      const product = await this.productRepo.create(p);
      const query = { $push: { products: product } };
      await this.categoryRepo.updateMapping(query, product.category as string);
      return product;
    } catch (error) {
      throw error;
    }
  }

  /**
   * @api {put} /api/product Update a product
   * @apiHeader {String} x-access-token Tokens review user permissions.
   * @apiPermission Admin
   * @apiSampleRequest http://localhost:3000/api/product
   * @apiSuccess {String} productName  Name of the product.
   * @apiSuccess {String} category  Id of the Category.
   * @apiSuccess {String} currentPrice  Current price of the product.
   * @apiSuccess {String} [oldPrice]  Old price of the product.
   * @apiSuccess {String} description  Description of the product.
   * @apiSuccess {String} title  Title of the product.
   * @apiSuccess {String} sex  Sex of the product (0: male | 1: female).
   * @apiSuccess {String} textSlug  Text slug of the product.
   * @apiSuccess {String[]} images  List image of the product.
   * @apiParamExample {json} Request-Example:
   * {
   *   "isDeleted": false,
   *   "productName": "Nón lưỡi trai",
   *   "category": "5d4c0609a5f4e7381005731f",
   *   "currentPrice": 290000,
   *   "oldPrice": null,
   *   "description": "Chất liệu dù phối da- lưới cao cấp.  Phong cách trẻ trung, năng động.  ĐỐI TƯỢNG:Nam và nữ.  VÒNG ĐẦU :52 cm – 59 cm (Mức chuẩn: 55 cm – 57 cm).",
   *   "title": "Nón lưỡi trai MC122C-CM1",
   *   "sex": 0,
   *   "textSlug": "non-luoi-trai-mc122c-cm1"
   * }
   * @apiName UpdateProduct
   * @apiGroup Product
   *
   * @apiSuccess {Boolean} isDeleted Delete status of the product.
   * @apiSuccess {String[]} images List image of the product.
   * @apiSuccess {String} createdAtDate  Product creation date.
   * @apiSuccess {String} productName  Name of the product.
   * @apiSuccess {String} category  Id of the Category.
   * @apiSuccess {String} currentPrice  Current price of the product.
   * @apiSuccess {String} [oldPrice]  Old price of the product.
   * @apiSuccess {String} description  Description of the product.
   * @apiSuccess {String} title  Title of the product.
   * @apiSuccess {String} sex  Sex of the product (0: male | 1: female).
   * @apiSuccess {String} textSlug  Text slug of the product.
   * @apiSuccess {Object[]} feedback  Feedback of the product.
   * @apiSuccess {String} feedback.createdAtDate  Feedback creation date.
   * @apiSuccess {String} feedback._id  Id of the feedback.
   * @apiSuccess {String} feedback.customer  Id of the Customer.
   * @apiSuccess {String} feedback.content  Content of the feedback about product.
   * @apiSuccessExample Success-Response:
   *     HTTP/1.1 200 OK
   *       {
   *           "images": [],
   *           "isDeleted": false,
   *           "createdAtDate": "2019-08-17T12:33:08.045Z",
   *           "_id": "5d57f56f91b8bb2478b03b4f",
   *           "productName": "Nón lưỡi trai",
   *           "category": "5d4c0609a5f4e7381005731f",
   *           "currentPrice": 199000,
   *           "oldPrice": null,
   *           "description": "Chất liệu dù phối da- lưới cao cấp.  Phong cách trẻ trung, năng động.  ĐỐI TƯỢNG:           Nam và nữ.  VÒNG ĐẦU :           52 cm – 59 cm (Mức chuẩn: 55 cm – 57 cm).",
   *           "title": "Nón lưỡi trai MC122C-CM1",
   *           "sex": 0,
   *           "textSlug": "ao-so-mi",
   *           "feedback": [],
   *           "__v": 0,
   *           "id": "5d57f56f91b8bb2478b03b4f"
   *       }
   */
  @httpPut("/", upload.any(), parser([constants.ROLES.ADMIN]))
  public async update(req: any): Promise<any> {
    try {
      const { body } = req;
      let images = [];
      if (req.files) {
        for (let index = 0; index < req.files.length; index++) {
          images.push(`products/${req.files[index].filename}`);
        }
      }
      const product = await this.productRepo.findOne({
        _id: (body as IProduct).id
      });
      body.images = (product.images as string[]).concat(images);
      return await this.productRepo.update(body);
    } catch (error) {
      throw error;
    }
  }

  /**
   * @api {put} /api/product/feedback Add feedback into product
   * @apiHeader {String} x-access-token Tokens review user permissions.
   * @apiPermission Admin
   * @apiSampleRequest http://localhost:3000/api/product
   * @apiParam {String} product ID of the product.
   * @apiParam {String} content content of feedback.
   * @apiParamExample {json} Request-Example:
   * {
   *   "product": "5d57f56f91b8bb2478b03b4f",
   *   "content": "San pham chat luong tot"
   * }
   * @apiName AddFeedBackProduct
   * @apiGroup Product
   *
   * @apiSuccess {Boolean} isDeleted Delete status of the product.
   * @apiSuccess {String[]} images List image of the product.
   * @apiSuccess {String} createdAtDate  Product creation date.
   * @apiSuccess {String} productName  Name of the product.
   * @apiSuccess {String} category  Id of the Category.
   * @apiSuccess {String} currentPrice  Current price of the product.
   * @apiSuccess {String} [oldPrice]  Old price of the product.
   * @apiSuccess {String} description  Description of the product.
   * @apiSuccess {String} title  Title of the product.
   * @apiSuccess {String} sex  Sex of the product (0: male | 1: female).
   * @apiSuccess {String} textSlug  Text slug of the product.
   * @apiSuccess {Object[]} feedback  Feedback of the product.
   * @apiSuccess {String} feedback.createdAtDate  Feedback creation date.
   * @apiSuccess {String} feedback._id  Id of the feedback.
   * @apiSuccess {String} feedback.customer  Id of the Customer.
   * @apiSuccess {String} feedback.content  Content of the feedback about product.
   * @apiSuccessExample Success-Response:
   *     HTTP/1.1 200 OK
   *       {
   *           "images": [],
   *           "isDeleted": false,
   *           "createdAtDate": "2019-08-17T12:33:08.045Z",
   *           "_id": "5d57f56f91b8bb2478b03b4f",
   *           "productName": "Nón lưỡi trai",
   *           "category": "5d4c0609a5f4e7381005731f",
   *           "currentPrice": 199000,
   *           "oldPrice": null,
   *           "description": "Chất liệu dù phối da- lưới cao cấp.  Phong cách trẻ trung, năng động.  ĐỐI TƯỢNG:           Nam và nữ.  VÒNG ĐẦU :           52 cm – 59 cm (Mức chuẩn: 55 cm – 57 cm).",
   *           "title": "Nón lưỡi trai MC122C-CM1",
   *           "sex": 0,
   *           "textSlug": "ao-so-mi",
   *           "feedback": [
   *               {
   *                   "createdAtDate": "2019-08-17T12:50:18.994Z",
   *                   "_id": "5d57f80a91b8bb2478b03b50",
   *                   "customer": "5d57ed8c59a0fd2044442d8f",
   *                   "content": "San pham chat luong tot"
   *               }
   *           ],
   *           "__v": 0,
   *           "id": "5d57f56f91b8bb2478b03b4f"
   *       }
   */
  @httpPut("/feedback", parser([constants.ROLES.ADMIN, constants.ROLES.USER]))
  public async updateFeeback(req: any, res: Response) {
    try {
      const { body } = req;
      const product = await this.productRepo.findOne({ _id: body.product });
      if (product) {
        const feedback: IFeedback = {
          customer: req.user.id,
          content: body.content,
          createdAtDate: new Date(Date.now())
        };
        return await this.productRepo.update(product, feedback);
      }
    } catch (error) {
      return res.status(500).json({ statusCode: 500, message: error.message });
    }
  }

  /**
   * @api {delete} /api/product/:id Delete product with ID
   * @apiHeader {String} x-access-token Tokens review user permissions.
   * @apiSampleRequest http://localhost:3000/api/product
   * @apiParam {String} id ID of the product.
   * @apiParamExample {json} Request-Example:
   * {
   *      "id":"5d57f56f91b8bb2478b03b4f"
   * }
   * @apiName DeleteProductByID
   * @apiGroup Product
   *
   * @apiSuccess {Boolean} isDeleted Delete status of the product.
   * @apiSuccess {String[]} images List image of the product.
   * @apiSuccess {String} createdAtDate  Product creation date.
   * @apiSuccess {String} productName  Name of the product.
   * @apiSuccess {String} category  Id of the Category.
   * @apiSuccess {String} currentPrice  Current price of the product.
   * @apiSuccess {String} [oldPrice]  Old price of the product.
   * @apiSuccess {String} description  Description of the product.
   * @apiSuccess {String} title  Title of the product.
   * @apiSuccess {String} sex  Sex of the product (0: male | 1: female).
   * @apiSuccess {String} textSlug  Text slug of the product.
   * @apiSuccess {Object[]} feedback  Feedback of the product.
   * @apiSuccess {String} feedback.createdAtDate  Feedback creation date.
   * @apiSuccess {String} feedback._id  Id of the feedback.
   * @apiSuccess {String} feedback.customer  Id of the Customer.
   * @apiSuccess {String} feedback.content  Content of the feedback about product.
   * @apiSuccessExample Success-Response:
   *     HTTP/1.1 200 OK
   *       {
   *            "isDeleted": true,
   *            "message": "Successfully deleted product with id: 5d57f56f91b8bb2478b03b4f"
   *       }
   * @apiError NotAuthorization Not authorized.
   * @apiError NotPermission You have not permission.
   * @apiError BadRequest1 Không thể xóa sản phẩm này, vì nó đang nằm trong 1 giỏ hàng.
   * @apiError BadRequest2 Xóa thất bại. Kiểm tra lại.
   *
   *
   * @apiErrorExample Error-Response:
   *     HTTP/1.1 401 NotAuthorization
   *     {
   *       "statusCode": 401,
   *       "message": "NotAuthorization"
   *     },
   *     HTTP/1.2 403 NotPermission
   *     {
   *       "statusCode": 403,
   *       "message": "NotPermission"
   *     }
   *     HTTP/1.3 400 BadRequest1
   *     {
   *       "statusCode": 400,
   *       "message": "BadRequest1"
   *     }
   *     HTTP/1.4 400 BadRequest2
   *     {
   *       "statusCode": 400,
   *       "message": "BadRequest2"
   *     }
   */
  // không cho xóa sản phẩm nếu đang tồn tại ở 1 giỏ hàng nào đó !
  @httpDelete("/:id", parser([constants.ROLES.ADMIN]))
  public async delete(req: Request, res: Response): Promise<any> {
    try {
      const { id } = req.params;
      const product = await this.productRepo.findOne({ _id: id });
      if (product) {
        const result = await this.orderRepo.checkProductExist(
          product.id as string
        );
        if (result) {
          return res.status(400).json({
            statusCode: 400,
            message: `Không thể xóa sản phẩm này, vì nó đang nằm trong 1 giỏ hàng.`
          });
        }
        product.isDeleted = true;
        const query = { $pull: { products: { $in: id } } };
        await this.categoryRepo.updateMapping(
          query,
          product.category as string
        );
        const updated = await this.productRepo.update(product);
        if (updated) {
          return res.status(200).json({
            isDeleted: true,
            message: `Successfully deleted product with id: ${id}`
          });
        }
      }
      return res
        .status(400)
        .json({ statusCode: 400, message: "Xóa thất bại. Kiểm tra lại" });
    } catch (error) {
      throw error;
    }
  }
}

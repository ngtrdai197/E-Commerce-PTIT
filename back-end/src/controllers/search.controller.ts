import { controller, httpGet, requestParam } from "inversify-express-utils";
import { TYPES } from "../common";
import { Response, Request } from "express";
import { IProductRepository } from "../IRepositories";
import { inject } from "inversify";
import { IProduct } from "../entities";

@controller('/search')
export class SearchController {
    constructor(@inject(TYPES.IProductRepository) private productRepo: IProductRepository) { }
    /**
     * @api {get} /api/search Search by keyword and paging
     * @apiHeader {String} x-access-token Tokens review user permissions.
     * @apiSampleRequest http://localhost:3000/
     * @apiParam {String} [keyword] keywords you want to search (Default: "show").
     * @apiParam {Number} sort 1 or -1 to arrange.
     * @apiParam {Number} sex Sex wants to search.
     * @apiParam {Number} page Page to search.
     * @apiParam {Number} perPage Number of products you want to display.
     * @apiParamExample Request-Example:
     * ?keyword=ao-so-mi&sort=1&sex=0&page=1&perPage=10
     * @apiName Search
     * @apiGroup Search
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
     *
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
     *
     * @apiError NotAuthorization Not authorized.
     * 
     *
     * @apiErrorExample Error-Response:
     *     HTTP/1.1 401 NotAuthorization
     *     {
     *       "statusCode": 401,
     *       "message": "NotAuthorization" 
     *     }
     */
    @httpGet('/')
    public async onSearch(req: Request, res: Response): Promise<IProduct[] | any> {
        try {
            const query = {
                keyword: req.query.keyword,
                sort: req.query.sort,
                sex: req.query.sex,
                page: +req.query.page,
                perPage: +req.query.perPage,
            }
            const products = await this.productRepo.search(query);
            if (products) {
                return products;
            }
            return Promise.resolve([]);
        } catch (error) {
            throw error;
        }
    }
    /**
     * @api {get} /api/search/filter/:categoryId Get related products by category
     * @apiHeader {String} x-access-token Tokens review user permissions.
     * @apiSampleRequest http://localhost:3000/
     * @apiParam {String} categoryId CategoryID you want to filter.
     * @apiName FilterRelatedProduct
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
     * @apiSuccess {String} sex  Sex of the product.
     * @apiSuccess {String} textSlug  Text slug of the product.
     * @apiSuccess {Object[]} feedback  Feedback of the product.
     * @apiSuccess {String} feedback.createdAtDate  Feedback creation date.
     * @apiSuccess {String} feedback._id  Id of the feedback.
     * @apiSuccess {String} feedback.customer  Id of the Customer.
     * @apiSuccess {String} feedback.content  Content of the feedback about product.
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *  [
     *       {
     *           "images": [
     *               "products/1565263663135-ef0d6e6e-2a88-2100-67f0-00143f6b730a.jpg",
     *               "products/1565263663139-742e8676-7898-2200-7dce-00143f6b7312.jpg",
     *               "products/1565263663140-044c6aea-b2d6-2300-d35e-00143f6b731c.jpg"
     *           ],
     *           "isDeleted": false,
     *           "createdAtDate": "2019-08-08T11:09:17.291Z",
     *           "_id": "5d4c0720a5f4e73810057326",
     *           "productName": "Kính",
     *           "category": "5d4c0609a5f4e7381005731f",
     *           "currentPrice": 320000,
     *           "oldPrice": null,
     *           "description": "Kính",
     *           "title": "Kính",
     *           "sex": 0,
     *           "textSlug": "kinh",
     *           "feedback": [
     *               {
     *                   "createdAtDate": "2019-08-13T11:38:11.223Z",
     *                   "_id": "5d52a3f3f860c7309c11085a",
     *                   "customer": "5d404d8e2efb4a177fb1944a",
     *                   "content": "kinh rat dep"
     *               }
     *           ],
     *           "__v": 0,
     *           "id": "5d4c0720a5f4e73810057326"
     *       },
     *       {
     *           "images": [
     *               "products/1565445345025-non-son-chinh-hang22-600x600.jpg",
     *               "products/1565445345036-non-son-chinh-hang28-600x600.jpg"
     *           ],
     *           "isDeleted": false,
     *           "createdAtDate": "2019-08-10T12:35:28.999Z",
     *           "_id": "5d4ecc698e6fa21368b83a72",
     *           "productName": "Nón kết",
     *           "category": "5d4c0609a5f4e7381005731f",
     *           "currentPrice": 350000,
     *           "oldPrice": null,
     *           "description": "Chất liệu dù phối da- lưới cao cấp.  Phong cách trẻ trung, năng động".
     *           "title": "Nón kết MC122C-CM1",
     *           "sex": 0,
     *           "textSlug": "non-ket-mc122c-cm1",
     *           "feedback": [
     *               {
     *                   "createdAtDate": "2019-08-12T14:44:37.491Z",
     *                   "_id": "5d517cce423bd12ddcb287e5",
     *                   "customer": "5d23854f4b8ef2352e6b146a",
     *                   "content": "mũ đẹp quá"
     *               },
     *               {
     *                   "createdAtDate": "2019-08-13T10:29:46.131Z",
     *                   "_id": "5d5293675cc5b0196888c4fe",
     *                   "customer": "5d23854f4b8ef2352e6b146a",
     *                   "content": "haha"
     *               },
     *               {
     *                   "createdAtDate": "2019-08-16T11:30:44.452Z",
     *                   "_id": "5d5693e45ff903036b4f6faa",
     *                   "customer": "5d5681af86960171f4b08f94",
     *                   "content": "mu dep"
     *               }
     *           ],
     *           "__v": 0,
     *           "id": "5d4ecc698e6fa21368b83a72"
     *       }
     *   ]
     *
     * @apiError NotAuthorization Not authorized.
     * 
     *
     * @apiErrorExample Error-Response:
     *     HTTP/1.1 401 NotAuthorization
     *     {
     *       "statusCode": 401,
     *       "message": "NotAuthorization" 
     *     }
     */
    @httpGet('/filter/:categoryId')
    public async onRelatedProduct(@requestParam('categoryId') categoryId: string, res: Response): Promise<IProduct[] | any> {
        try {
            const query = { category: categoryId, isDeleted: false };
            const products = await this.productRepo.relatedProduct(query);
            return products;
        } catch (error) {
            throw error;
        }
    }
}
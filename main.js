import { getProducts, getUsers, getCompanies, getReviews } from "./api.js";

import { User } from "./classes/User.js";
import { Company } from "./classes/Company.js";
import { Review } from "./classes/Review.js";
import { Product } from "./classes/Product.js";

async function getAllData(){
    try {
        const [companiesData, reviewsData, usersData, productsData] = await Promise.all([
            getCompanies(),
            getReviews(),
            getUsers(),
            getProducts(),
        ]);

        const userInstances = [];
        for (const userData of usersData) {
            userInstances.push(new User(userData.id, userData.name));
        }

        const reviewInstances = [];
        for (const reviewData of reviewsData) {
            const user = userInstances.find((user) => user.id === reviewData.userId);
            reviewInstances.push(new Review(reviewData.id, reviewData.text, user));
        }

        const companyInstances = [];
        for (const companyData of companiesData) {
            companyInstances.push(new Company(companyData.id, companyData.name, companyData.created, companyData.country, []));
        }

        const productInstances = [];
        for (const productData of productsData) {
            const company = companyInstances.find((comp) => comp.id === productData.companyId);
            if (company) { // Проверяем, что компания существует
                const productReviews = [];
                for (const reviewId of productData.reviewIds) {
                    const review = reviewInstances.find((rev) => rev.id === reviewId);
                    if (review) {
                        productReviews.push(review);
                    }
                }
                const product = new Product(productData.id, productData.name, productData.description, company, productReviews);
                productInstances.push(product);
                company.products.push(product);
            }
        }

        const result = {
            users: userInstances,
            companies: companyInstances,
            reviews: reviewInstances,
            products: productInstances,
        };

        console.log(result);
    } catch (error) {
        console.error(error);
    }
}

getAllData();

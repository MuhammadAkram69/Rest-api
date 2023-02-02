const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Blog = require("./models/Blog");

// const Product=require('./models/product');
//Route to fetch Blog
router.get('/', (req, res, next) => {

    Blog.find()
        // .populate('product', 'name')
        .exec()
        .then(docs => {
            console.log(docs);
            res.status(200).json({
                count: docs.length,
                Blogs: docs.map(doc => {
                    console.log(doc);

                    return {
                        _id: doc._id,
                        title: doc.title,
                        body: doc.body,
                        author: doc.author,
                        request: {
                            Type: "GET",
                            url: "https://localhost:8000/" + doc._id
                        }

                    }
                })
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })

        });
});

//Route to add blog

router.post('/blogs', (req, res, next) => {
    Blog.findById(req.body.blogId)
        .then(blog => {
            console.log(req.body);
            if (blog) {
                return res.status(200).json({
                    message: "Blog already exist!"
                });
            }
            const blogsss = new Blog({


                _id: mongoose.Types.ObjectId(),
                title: req.body.title,
                body: req.body.body,
                author: req.body.author

            });
            return blogsss
                .save()
                .then(result => {
                    console.log(result),
                        res.status(201).json({
                            message: "Blog Created successfully!",
                            BlogDetails: {
                                title: result.title,
                                body: result.body,
                                author: result.author
                            },
                        });
                })
                .catch(err => {
                    console.log(err),
                        res.status(500).json({
                            error: err
                        });
                });
        });
});

// //Route to fetch individual order

router.get('/:id', (req, res, next) => {
    console.log(req.params);
    Blog.findById(req.params.id)
        .then(blog => {
            console.log(blog);
            res.status(200).json({
                blog: blog
            });
        })
        .catch(err => {
            console.log(err),
                res.status(500).json({
                    error: err
                });
        })
});

// //Route to delete order

router.delete('/:id', (req, res, next) => {
    Order.remove({ _id: req.params.id }).exec()
        .then(result => {
            res.status(200).json({
                message: "Product deleted!",
                request: {
                    Type: "POST",
                    URL: "https://localhost:8000/orders",
                    body: { product: "id", quantity: "Number" }
                }
            })
        })
        .catch(err => {
            console.log(err),
                res.status(500).json({
                    error: err
                });
        });
});
module.exports = router;
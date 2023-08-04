const generateProductErrorInfo = (product) => {
  return `One or more properties were incomplete or not valid.
    List of required properties:
    * title: needs to be a string, received ${product.title}
    * description: needs to be a string, received ${product.description}
    * code: needs to be a string, received ${product.code}
    * price: needs to be a string, received ${product.price}
    * stock: needs to be a string, received ${product.stock}
    * category: needs to be a string, received ${product.category}
    * thumbnail: needs to be a string, received ${product.thumbnail}`;
};

module.exports = generateProductErrorInfo;

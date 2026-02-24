import Map "mo:core/Map";
import Iter "mo:core/Iter";
import Time "mo:core/Time";
import Text "mo:core/Text";
import Runtime "mo:core/Runtime";
import Storage "blob-storage/Storage";
import MixinStorage "blob-storage/Mixin";

actor {
  include MixinStorage();

  public type Product = {
    id : Text;
    name : Text;
    category : ProductCategory;
    price : Nat;
    image : Storage.ExternalBlob;
    createdAt : Time.Time;
  };

  public type ProductCategory = {
    #pouch;
    #keychain;
    #sticker;
    #poster;
    #others;
  };

  let products = Map.empty<Text, Product>();

  // Create a new product
  public shared ({ caller }) func createProduct(
    id : Text,
    name : Text,
    category : ProductCategory,
    price : Nat,
    image : Storage.ExternalBlob,
  ) : async Product {
    if (name == "") {
      Runtime.trap("Product name cannot be empty");
    };
    if (price == 0) {
      Runtime.trap("Product price must be greater than 0");
    };

    let now = Time.now();

    let newProduct : Product = {
      id;
      name;
      category;
      price;
      image;
      createdAt = now;
    };

    products.add(id, newProduct);
    newProduct;
  };

  // Get all products
  public query ({ caller }) func getAllProducts() : async [Product] {
    products.values().toArray();
  };

  // Get products by category
  public query ({ caller }) func getProductsByCategory(category : ProductCategory) : async [Product] {
    products.values().filter(
      func(product) {
        product.category == category;
      }
    ).toArray();
  };

  // Get product by id
  public query ({ caller }) func getProduct(id : Text) : async ?Product {
    products.get(id);
  };
};

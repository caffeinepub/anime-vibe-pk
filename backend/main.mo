import Map "mo:core/Map";
import Iter "mo:core/Iter";
import Time "mo:core/Time";
import Text "mo:core/Text";
import Nat "mo:core/Nat";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import Storage "blob-storage/Storage";
import MixinStorage "blob-storage/Mixin";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  include MixinStorage();

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  public type UserProfile = {
    name : Text;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can get profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public type Product = {
    id : Text;
    name : Text;
    description : Text;
    category : ProductCategory;
    price : Nat;
    photos : [Text];
    imageUrl : Text;
    createdAt : Int;
    sizes : [Text];
    colors : [Text];
    gender : Gender;
  };

  public type ProductCategory = {
    #pouch;
    #keychain;
    #sticker;
    #poster;
    #others;
  };

  public type Gender = {
    #male;
    #female;
    #unisex;
  };

  public type Review = {
    id : Nat;
    productId : Nat;
    reviewerName : Text;
    rating : Nat; // 1-5
    comment : Text;
    createdAt : Int;
  };

  let products = Map.empty<Text, Product>();
  let reviews = Map.empty<Nat, Review>();
  var nextReviewId = 0;

  public shared ({ caller }) func createProduct(
    id : Text,
    name : Text,
    description : Text,
    category : ProductCategory,
    price : Nat,
    photos : [Text],
    imageUrl : Text,
    sizes : [Text],
    colors : [Text],
    gender : Gender,
  ) : async Product {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can create products");
    };
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
      description;
      category;
      price;
      photos;
      imageUrl;
      createdAt = now;
      sizes;
      colors;
      gender;
    };

    products.add(id, newProduct);
    newProduct;
  };

  public query func getAllProducts() : async [Product] {
    products.values().toArray();
  };

  public query func getProductsByCategory(category : ProductCategory) : async [Product] {
    products.values().filter(
      func(product) {
        product.category == category;
      }
    ).toArray();
  };

  public query func getProduct(id : Text) : async ?Product {
    products.get(id);
  };

  public shared ({ caller }) func addReview(
    productId : Nat,
    reviewerName : Text,
    rating : Nat,
    comment : Text,
  ) : async Review {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add reviews");
    };
    if (rating < 1 or rating > 5) {
      Runtime.trap("Rating must be between 1 and 5");
    };
    let reviewId = nextReviewId;
    nextReviewId += 1;

    let newReview : Review = {
      id = reviewId;
      productId;
      reviewerName;
      rating;
      comment;
      createdAt = Time.now();
    };

    reviews.add(reviewId, newReview);
    newReview;
  };

  public query func getReviewsByProduct(productId : Nat) : async [Review] {
    reviews.values().filter(
      func(review) {
        review.productId == productId;
      }
    ).toArray();
  };

  public shared ({ caller }) func deleteProduct(id : Text) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete products");
    };
    let existed = products.containsKey(id);
    products.remove(id);
    existed;
  };

  public shared ({ caller }) func deleteAllProducts() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete all products");
    };
    products.clear();
  };
};

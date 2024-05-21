import API from "./API";

class UserAPI extends API {
  static get_users = () => {
    return this.getRequest(`users`);
  };

  static create_user = (data: any) => {
    return this.postRequest(`users`, data);
  };

  static update_user = (id: number, data: any) => {
    return this.putRequest(`users/update/${id}`, data);
  };

  static delete_user = (id: number) => {
    return this.deleteRequest(`users/delete/${id}`, {});
  };
}

export default UserAPI;

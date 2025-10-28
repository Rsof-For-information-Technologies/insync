export const routes = {
  dashboard: "/dashboard",
  chatbot: "/chatbot",
  channel: "/channel",

  tenant:{
    list: "/tenant",
    create: "/tenant/create",
    tenantDetails: (tenantId: string) => `/tenant/${tenantId}`,
    editTenant: (tenantId: string) => `/tenant/${tenantId}/update`,
  },

  organization:{
    list: "/organization",
    create: "/organization/create",
    organizationDetails: (organizationId: string) => `/organization/${organizationId}`,
    editOrganization: (organizationId: string) => `/organization/${organizationId}/update`,
  },

  user: {
    list: "/user",
    create: "/user/create",
    userDetails: (userId: string) => `/user/${userId}`,
    editUser: (userId: string) => `/user/${userId}/update`,
  },

  auth:{
    login: "/auth/login",
    signup: "/auth/signup",
    forgotPassword: "/auth/forgotPassword",
    resetPassword: "/auth/resetPassword",
  },

  profile: {
    editProfile: "/profile/edit-profile",
    changePassword: "/profile/changePassword",
    userProfile: "/profile/userProfile",
  },

  contact: {
    list: "/contact",
    create: "/contact/create",
    contactDetails: (contactId: string) => `/contact/${contactId}`,
    editContact: (contactId: string) => `/contact/${contactId}/update`,
  },
};

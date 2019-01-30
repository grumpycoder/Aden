﻿using System;
using System.Security.Claims;
using System.Text;
using System.Web;
using System.Web.Mvc;

namespace AdenDemo.Web.Helpers
{
    public static class AlsdeHtmlHelper
    {
        public static IHtmlString UserNavBarMenuList(this HtmlHelper htmlHelper, string position, string appUserGroup, string appAdminGroup)
        {
            var identity = ((ClaimsIdentity)HttpContext.Current.User.Identity);
            var sb = new StringBuilder();
            var cssClass = GetCssClass();

            sb.AppendFormat("<ul class='nav navbar-nav pull-{0} {1}'>", position, cssClass);

            //if (!identity.IsAuthenticated)
            //{
            //    //TODO: Create return to aim link
            //    sb.AppendFormat("<li><a href='{0}aim/ApplicationInventory.aspx'><i class='fa fa-home'></i> My Applications</a></li>", Constants.AimBaseUrl);
            //    sb.Append("</ul>");
            //    return MvcHtmlString.Create(sb.ToString());
            //}

            sb.Append(@"<li class='dropdown'>");
            sb.AppendFormat(
                @"<a href='#' class='dropdown-toggle' data-toggle='dropdown' role='button' aria-haspopup='true' aria-expanded='false'><i class='fa fa-user'></i>&nbsp;{0}<span class='caret'></span></a>",
                identity.Name ?? "Unknown");


            sb.Append("<ul class='dropdown-menu'>");

            sb.AppendFormat("<li><a href='{0}aim/ApplicationInventory.aspx'><i class='fa fa-home'></i> My Applications</a></li>", Constants.AimBaseUrl);
            sb.AppendFormat("<li><a href='{0}aim/UserProfile.aspx'><i class='fa fa-book'></i> User Profile</a></li>", Constants.AimBaseUrl);
            sb.AppendFormat("<li><a href='{0}aim/EdDirPositions.aspx'><i class='fa fa-university'></i> EdDir Positions</a></li>", Constants.AimBaseUrl);
            sb.Append("<li role='separator' class='divider'></li>");


            //if (identity.HasClaim("http://schemas.microsoft.com/ws/2008/06/identity/claims/role", appUserGroup))
            //{
            sb.Append("<li class='dropdown-header'>AIM Groups and Users</li>");
            sb.AppendFormat("<li><a href='{0}aim/admin/RolesAndUsers.aspx'><i class='fa fa-group'></i> Groups and Users</a></li>", Constants.AimBaseUrl);
            sb.AppendFormat("<li><a href='{0}aim/admin/UserMaintenance.aspx'><i class='fa fa-user'></i> User Maintenance</a></li>", Constants.AimBaseUrl);
            sb.AppendFormat("<li><a href='{0}aim/alsde/AppMembership.aspx'><i class='fa fa-heartbeat'></i> App Members</a></li>", Constants.AimBaseUrl);
            sb.Append("<li role='separator' class='divider'></li>");
            //}

            //if (identity.HasClaim("http://schemas.microsoft.com/ws/2008/06/identity/claims/role", appAdminGroup))
            //{
            sb.Append("<li class='dropdown-header'>AIM Administration</li>");
            sb.AppendFormat(
                "<li><a href='{0}aim/admin/EditMessages.aspx'><i class='fa fa-comment'></i> Messages</a></li>",
                Constants.AimBaseUrl);
            sb.AppendFormat(
                "<li><a href='{0}aim/admin/WebsitesandApplications.aspx'><i class='fa fa-sitemap'></i> Websites and Applications</a></li>",
                Constants.AimBaseUrl);
            sb.AppendFormat(
                "<li><a href='{0}aim/admin/Groups.aspx''><i class='fa fa-cogs'></i> Group/Subgroup Maintenance</a></li>",
                Constants.AimBaseUrl);
            sb.AppendFormat(
                "<li><a href='{0}aim/alsde/LoadGroups.aspx'><i class='fa fa-cogs'></i> Load Groups</a></li>",
                Constants.AimBaseUrl);
            sb.Append("<li role='separator' class='divider'></li>");
            //}

            //if (LoginHelper.CurrentUser.ImpersonateEmailAddress != HttpContext.Current.User.Identity.Name)
            //{
            //    sb.AppendFormat(
            //        "<li><a href='{0}aim/Index.aspx?Impersonate=0'><i class='fa fa-stop'></i> Stop Impersonating</a></li>",
            //        Constants.AimBaseUrl);
            //    sb.Append("<li role='separator' class='divider'></li>");
            //}

            sb.Append("<li><a href='/account/signout'><i class='fa fa-sign-out'></i> Logout</a></li>");
            sb.Append("</ul>");

            sb.Append("<li><a href='/account/signout'><i class='fa fa-sign-out'></i> Logout</a></li>");

            sb.Append("</ul>");

            return MvcHtmlString.Create(sb.ToString());
        }

        public static IHtmlString RenderStatusBarColor(this HtmlHelper htmlHelper)
        {
            var cssClass = GetCssClass();

            return MvcHtmlString.Create(cssClass);
        }

        private static string GetCssClass()
        {
            string cssClass;
            Enum.TryParse(Constants.Environment, out Environment env);

            //var env = (Environment)Enum.Parse(typeof(Environment), Constants.Environment);

            switch (env)
            {
                case Environment.Dev:
                    cssClass = "bg-orange";
                    break;
                case Environment.Test:
                    cssClass = "bg-blue";
                    break;
                case Environment.Stage:
                    cssClass = "bg-yellow";
                    break;
                case Environment.Production:
                    cssClass = "bg-white";
                    break;
                default:
                    cssClass = "bg-orange";
                    break;
            }

            return cssClass;
        }

    }
}
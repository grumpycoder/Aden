using Aden.Web.Data;
using Aden.Web.Helpers;
using Aden.Web.Services;
using Alsde.Security.Identity;
using System;
using System.Security.Claims;
using System.Web.Mvc;

namespace Aden.Web.Controllers
{
    public class AccountController : Controller
    {
        private readonly AdenContext _context;
        private readonly MembershipService _membershipService;

        public AccountController()
        {
            _context = new AdenContext();
            _membershipService = new MembershipService(_context);
        }

        //Callback url from TPA login
        public ActionResult LoginCallback(string token)
        {
            var tokenKey = new TokenKey(token, Constants.TpaAccessKey);

            var result = IdentityManager.TokenSignin(Constants.WebServiceUrl, tokenKey);

            Session["LoginFailureMessage"] = string.Empty;
            if (result.IsFailure)
            {
                Session["LoginFailureMessage"] = result.Error;
                return RedirectToAction("LoginFailure", "Account");
            }

            var identity = result.Value;
            if (identity == null) throw new Exception("No identity returned from Token signin");

            _membershipService.SyncClaims(identity);

            var landingPage = identity.GetClaimValue(ClaimTypes.Webpage);
            return RedirectToAction(landingPage, "Home");

        }


        public ActionResult Signout()
        {
            IdentityManager.IdentitySignout();

            var logoutUrl = $"https://{Constants.LogoutUrl}{Constants.AimApplicationViewKey}";

            return Redirect(logoutUrl);
        }

        public ActionResult Unauthorized()
        {
            return View();
        }

        public ActionResult LoginFailure(string message)
        {
            ViewBag.Message = Session["LoginFailureMessage"];
            return View();
        }
    }
}
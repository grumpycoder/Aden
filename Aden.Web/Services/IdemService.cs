﻿using Aden.Web.Data;
using ALSDE.Dtos;
using ALSDE.Idem.Web.UI.AimBanner;
using Dapper;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Text;

namespace Aden.Web.Services
{
    public class IdemService
    {
        private IdemContext _context;

        public IdemService()
        {
            _context = new IdemContext();
        }

        public List<IdemApplication> GetApplication()
        {
            var query = "select ApplicationId, ApplicationViewKey, WebsiteViewKey, Title, Description, SectionViewKey from Idem.Applications order by title";
            using (var cn = new SqlConnection(_context.Database.Connection.ConnectionString))
            {
                var list = cn.Query<IdemApplication>(query).ToList();
                return list;
            }
        }

        public AuthenticatedUserDto GetUser(Guid identityGuid)
        {
            var query = "select top 1 LastName, FirstName, EmailAddress, IdentityGuid from Idem.Identities WHERE IdentityGuid = @IdentityGuid";
            using (var cn = new SqlConnection(_context.Database.Connection.ConnectionString))
            {
                var idemUser = cn.Query<AuthenticatedUserDto>(query, new { @IdentityGuid = identityGuid }).SingleOrDefault();
                return idemUser;
            }
        }

        public List<AuthenticatedUserDto> FindUsers(string searchTerm, bool internalOnly = true)
        {
            StringBuilder query = new StringBuilder();
            query.Append("select top 15 LastName, FirstName, EmailAddress, " +
                        "IdentityGuid from Idem.Identities " +
                        "WHERE " +
                        "(LastName like '%' + @SearchString + '%' OR " +
                        "PrintName like '%' + @SearchString + '%' OR " +
                        "EmailAddress LIKE '%' + @SearchString + '%')" );

            var extendedQuery = internalOnly ? " AND EmailAddress LIKE '%alsde.edu'" : "";

            query.Append(extendedQuery); 

            using (var cn = new SqlConnection(_context.Database.Connection.ConnectionString))
            {
                var list = cn.Query<AuthenticatedUserDto>(query.ToString(), new { @SearchString = searchTerm }).ToList();
                return list;
            }
        }

     
    }
}

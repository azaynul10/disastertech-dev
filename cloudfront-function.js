function handler(event) {
  var request = event.request;
  var response = event.response;

  // Add security headers with comprehensive CSP for 2025 best practices
  response.headers["content-security-policy"] = {
    value:
      "default-src 'self'; script-src 'self' 'unsafe-inline' 'blob:' https://www.google.com https://www.gstatic.com https://cdn.jsdelivr.net; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdn.jsdelivr.net; font-src 'self' https://fonts.gstatic.com https://cdn.jsdelivr.net; img-src 'self' data: blob:; connect-src 'self' https://9l5b7yhwsk.execute-api.us-east-1.amazonaws.com; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none';",
  };

  response.headers["strict-transport-security"] = {
    value: "max-age=31536000; includeSubDomains",
  };

  response.headers["x-content-type-options"] = {
    value: "nosniff",
  };

  response.headers["x-frame-options"] = {
    value: "DENY",
  };

  response.headers["x-xss-protection"] = {
    value: "1; mode=block",
  };

  // Add cache headers for static assets
  if (
    request.uri.match(/\.(css|js|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot)$/)
  ) {
    response.headers["cache-control"] = {
      value: "public, max-age=31536000, immutable",
    };
  } else if (request.uri.match(/\.(html|xml|txt)$/)) {
    response.headers["cache-control"] = {
      value: "public, max-age=3600",
    };
  } else {
    response.headers["cache-control"] = {
      value: "public, max-age=86400",
    };
  }

  return response;
}

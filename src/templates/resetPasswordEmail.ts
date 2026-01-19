const RESET_PASSWORD_EMAIL = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Reset Password Email</title>
  </head>
  <body
    style="
      background-color: #f3f4f6;
      margin: 0;
      padding: 0;
      font-family: 'Segoe UI', sans-serif;
      color: #424853;
    "
  >
    <table
      width="100%"
      cellspacing="0"
      cellpadding="0"
      style="padding-bottom: 10px"
      role="presentation"
    >
      <tr align="center">
        <td>
          <table cellpadding="0" cellspacing="0">
            <tr>
              <td style="padding: 10px 0">
                <img
                  src="https://harnishdesign.net/demo/html/oxyy/images/logo-lg.png"
                  alt="Oxyy Logo"
                />
              </td>
            </tr>
          </table>
          <table
            cellspacing="0"
            cellpadding="0"
            width="100%"
            style="
              background-color: #ffffff;
              border-radius: 10px;
              overflow: hidden;
              box-shadow: 0 0 1px rgba(0, 0, 0, 0.5);
              max-width: 600px;
            "
          >
            <tr>
              <td style="background-color: #0d6efd">
                <h1 style="text-align: center; color: #ffffff">
                  Reset Password
                </h1>
              </td>
            </tr>
            <tr>
              <td style="padding: 20px">
                <table cellspacing="0" cellpadding="0" width="100%">
                  <tr>
                    <td>
                      <p style="margin-bottom: 25px; text-transform: uppercase">Hello {{firstname}},</p>
                      <p>
                       Kindly click the button below to reset your password.
                      </p>
                      <p style="margin-bottom: 25px">
                        This link is valid for <strong>15 minutes</strong>.
                        Please do not share this link with anyone.
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <a
                        href="{{resetLink}}"
                        style="
                          background-color: #0d6efd;
                          padding: 10px 20px;
                          text-decoration: none;
                          color: #ffffff;
                          font-weight: 700;
                          border-radius: 5px;
                        "
                        >Reset Password</a
                      >
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <p style="margin: 25px 0 8px 0">
                        If you didn't request this password reset, please ignore this
                        email.
                      </p>
                      <p>Thank you for using our service!</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <tr>
              <td>
                <p
                  style="
                    background-color: #f2f2f3;
                    padding: 20px;
                    font-size: 14px;
                    text-align: center;
                    margin: 0;
                  "
                >
                  &copy; 2026 Oxyy. All rights reserved.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`;

export default RESET_PASSWORD_EMAIL;

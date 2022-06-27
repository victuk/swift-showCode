const CryptoJS = require("crypto-js");

const { transporter } = require("../../utils/userUtil");

const cryptoSecret = process.env.cryptoSecret;

function addVoters(req, res) {
    const {votersList, electionID, userRole} = req.body;

    votersList.forEach(voter => {
        const randomPassword = Math.random().toString(36).slice(-8);
        
        bcryptjs.genSalt(10, (err, salt) => {
            bcryptjs.hash(randomPassword, salt, (error, hash) => {
                // store the hashed password
                let hashedPassword = hash;

                let voterElectionDetail = {
                    email: voter.email,
                    userDetails: voter,
                    electionID: electionID,
                    role: userRole,
                    password: hashedPassword
                };

                var ciphertext = CryptoJS.AES.encrypt(JSON.stringify(voterElectionDetail), cryptoSecret).toString();

                var mailOptions = {
                    from: "Swift Vote <no-reply@swiftvote.com>",
                    to: voter.email,
                    subject: "Swift Vote - Election Invitation",
                    html: `
                    <div style="padding: 20px">
                        <h1 style="background-color: blue; white: color: white;">Swift Vote OTP</h1>
                        You are hereby invited to This election
                          <div>
                          
                          <div> Register Token:  </div>
                          <div>
                          Click this link to login ${process.env.frontendUrl}/id?${ciphertext}
                          <div>Your password is: ${randomPassword}</div>
                          </div>
                          </div>
                        <style>
                              div, a {
                                padding: 20px 10px;
                              }
                        </style>
                    </div>
                    `,
                  };

                transporter.sendMail(mailOptions);
                
            });
        });
        

        var ciphertext = CryptoJS.AES.encrypt(JSON.stringify(payload), cryptoSecret).toString();
    });
}

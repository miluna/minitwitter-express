const resetPasswordBody = (password) => (`
<html>
    <body>
        <div>
            <p>Your Password has been reset succesfully</p>
            <p><strong>${password}</strong></p>
        </div>
    </body>
</html>
`);

export default resetPasswordBody;
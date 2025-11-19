import { Typography, Link } from "@mui/material";

export default function Copyright() {
    return (
        <Typography
            variant="body2"
            align="center"
            sx={{
                color: 'text.secondary',
                mt: 4
            }}>
            {'Made by '}
            <Link color="inherit" href="https://github.com/KlutzyBubbles">
                KlutzyBubbles
            </Link>.
        </Typography>
    );
}
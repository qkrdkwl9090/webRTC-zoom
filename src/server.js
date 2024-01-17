import express from "express";

const app = express();

const handleListen = () => console.log("Hello World!");

app.listen(3000, handleListen);

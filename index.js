import express from "express";
import bodyparser from "body-parser";

const app = express();
const port = 3000;

app.use(express.static("public"));
app.set("view engine", "ejs");

let data = [
    {
      id: 1,
      title: "The Rise of Decentralized Finance",
      content:
        "Decentralized Finance (DeFi) is an emerging and rapidly evolving field in the blockchain industry. It refers to the shift from traditional, centralized financial systems to peer-to-peer finance enabled by decentralized technologies built on Ethereum and other blockchains. With the promise of reduced dependency on the traditional banking sector, DeFi platforms offer a wide range of services, from lending and borrowing to insurance and trading.",
      author: "Alex Thompson",
      date: "2023-08-01T10:00:00Z",
    },
    {
      id: 2,
      title: "The Impact of Artificial Intelligence on Modern Businesses",
      content:
        "Artificial Intelligence (AI) is no longer a concept of the future. It's very much a part of our present, reshaping industries and enhancing the capabilities of existing systems. From automating routine tasks to offering intelligent insights, AI is proving to be a boon for businesses. With advancements in machine learning and deep learning, businesses can now address previously insurmountable problems and tap into new opportunities.",
      author: "Mia Williams",
      date: "2023-08-05T14:30:00Z",
    },
    {
      id: 3,
      title: "Sustainable Living: Tips for an Eco-Friendly Lifestyle",
      content:
        "Sustainability is more than just a buzzword; it's a way of life. As the effects of climate change become more pronounced, there's a growing realization about the need to live sustainably. From reducing waste and conserving energy to supporting eco-friendly products, there are numerous ways we can make our daily lives more environmentally friendly. This post will explore practical tips and habits that can make a significant difference.",
      author: "Samuel Green",
      date: "2023-08-10T09:15:00Z",
    },
  ];

let lastId = 3;

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended: true}));

app.get("/", (req, res) => {
    res.render("index.ejs", {posts: data});
});

app.get('/search', (req, res) => {
  const searchTitle = req.query.title.toLowerCase();
  const filteredPosts = data.filter(d => d.title.toLowerCase().includes(searchTitle));
  
  if (filteredPosts.length > 0) {
      res.render("index.ejs", { 
        posts: filteredPosts,
        message: `Search results for "${searchTitle}" (0.03s): `
       });
  } else {
      res.render("index.ejs", { posts: [] });
  }
});

app.get("/newblog", (req,res) => {
  res.render("newblog.ejs");
});

app.get("/contact", (req,res) =>  {
  res.render("contact.ejs");
});

app.post("/post", (req, res) => {
  const newId = ++lastId;
  const post = {
      id: newId,
      title: req.body.title,
      content: req.body.content,
      author: req.body.author,
      date: new Date().toISOString(),
  };
  data.push(post);
  res.redirect("/");
});

app.get("/blogpost/:id", (req, res) => {
  const postId = parseInt(req.params.id);
  const article = data.find(post => post.id === postId);
  if (article) {
    res.render("blogpost", { article,
      posts: data
     });
  } else {
    res.status(404).send('Post not found');
  }
});

app.get("/edit/:id", (req, res) => {
  const postId = parseInt(req.params.id);
  const article = data.find(post => post.id === postId);

  if (article) {
    res.render("edit.ejs", { article});
  } else {
    res.status(404).send('Post not found');
  }
});

app.post("/update/:id", (req, res) => {
  const postId = parseInt(req.params.id);
  const updatedPost = {
    id: postId,
    title: req.body.title,
    content: req.body.content,
    author: req.body.author,
    date: new Date().toISOString(),
  };
  const postIndex = data.findIndex((post) => post.id === postId);
  if (postIndex !== -1) {
    data[postIndex] = updatedPost;
    res.redirect("/");
  } else {
    res.status(404).send("Post not found");
  }
});

app.get("/delete/:id", (req, res) => {
  const postId = parseInt(req.params.id);
  const index = data.findIndex((d) => d.id === postId);
  if (index !== -1) {
      data.splice(index, 1);
      res.redirect("/");
  } else {
      res.status(404).send("Post not found");
  }
});

app.post('/send-email', (req, res) => {
  const { name, phone, email, message } = req.body;
  const subject = `Contact form submission from ${name}`;
  const body = `Name: ${name}\nPhone: ${phone}\nEmail: ${email}\nMessage: ${message}`;
  const mailtoUrl = `mailto:sreem7808@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  res.redirect(mailtoUrl);
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
  });
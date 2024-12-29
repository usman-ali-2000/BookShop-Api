require('./conn');
const mongoose = require('mongoose');
const express = require('express');
const app = express();
// const uploadLogin = require('./Login');
const Farm = require('./Farm');
const Variety = require('./Variety');
const Plot = require('./Plot');
const Category = require('./Category');
const Product = require('./Product');
const ProductCreate = require('./ProductCreate');
const Irrigationsr = require('./Irrigationsr');
const Job = require('./Job');
const DailyEntry = require('./DailyEntry');
const Vehicle = require('./Vehicle');
const FinancialSeason = require('./FinancialSeason');
const Fuel = require('./Fuel');
const AdminRegister = require('./AdminRegister');
const cors = require('cors');
const { Cart } = require('./Cart');
const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');
const Task = require('./Task');
const Asset = require('./Asset');
const Banner = require('./Banner');
const ScreenShot = require('./ScreenShot');

const PORT = process.env.PORT || 8000;

app.use(express.json());
const corsOptions = {
  origin: '*', // Replace with your frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
  credentials: true // Allow cookies if needed
};

app.use(cors(corsOptions));


const generateUniqueId = async () => {
  const date = new Date();
  const dateString = date.toISOString().slice(2, 10).replace(/-/g, ''); // YYMMDD

  // Use a counter collection to atomically increment the count
  const counter = await AdminRegister.findOneAndUpdate(
    { date: dateString },
    { $inc: { count: 1 } },
    { new: true, upsert: true }
  );

  // Generate the unique ID
  const uniqueId = `${dateString}${counter.count}`;

  return uniqueId;
};



const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 9000); // 6-digit OTP
};


// Create a POST route to send OTP
app.post('/send-otp', async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  // const existingUser = await AdminRegister.findOne({ email });
  //   if (existingUser) {
  //     return res.status(400).json({ msg: 'Email already exists' });
  //   }

  const otp = generateOTP(); // Generate a 6-digit OTP

  // Configure the Nodemailer transporter
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {

      user: 'wingedxnetwork@gmail.com',
      pass: 'ypfr himv ztwm uvej',
    },
  });

  // Email options
  const mailOptions = {

    from: 'wingedxnetwork@gmail.com',
    to: email,
    subject: 'Your OTP Code',
    text: `Your OTP code is ${otp}`,
  };

  try {
    // Send email
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'OTP sent successfully', otp }); // You might want to store OTP in the database or session
  } catch (error) {
    res.status(500).json({ message: 'Error sending email', error });
  }
});


app.get('/', (request, response) => {
  response.json({ info: 'Node.js, Express, and Postgres API...' })
})


app.post('/cart', async (req, res) => {
  try {
    const { email, status, items } = req.body; // Assume body contains email and items array

    // Create a new Cart entry
    const newCart = new Cart({
      email,
      status,
      items
    });

    // Save the cart to the database
    await newCart.save();

    res.status(201).json({ success: true, message: 'Cart created successfully', cart: newCart });
  } catch (error) {
    console.error('Error creating cart:', error);
    res.status(500).json({ success: false, message: 'Error creating cart', error });
  }
});

app.patch('/cart/:id', async (req, res) => {
  try {
    const { id } = req.params;  // Get cart ID from URL
    const { status, items } = req.body;  // Get new status and items from the body

    // Find the cart by ID and update the fields
    const updatedCart = await Cart.findByIdAndUpdate(
      id,
      { $set: { status, items } },  // Update status and items
      { new: true, runValidators: true }  // Ensure the updated document is returned and validators are run
    );

    // Check if the cart was found and updated
    if (!updatedCart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Cart updated successfully',
      cart: updatedCart
    });
  } catch (error) {
    console.error('Error updating cart:', error);
    res.status(500).json({ success: false, message: 'Error updating cart', error });
  }
});


app.get('/cart', async (req, res) => {
  try {
    // Find the cart for the user by email
    const cart = await Cart.find();

    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }

    res.status(200).json({ success: true, cart });
  } catch (error) {
    console.error('Error fetching cart:', error);
    res.status(500).json({ success: false, message: 'Error fetching cart', error });
  }
});


app.get('/banner', async (req, res) => {
  try {
    const banners = await Banner.find(); // Sort by createdAt in descending order
    res.status(200).json({ banners });
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve tasks' });
  }
});

app.post('/banner', async (req, res) => {
  const { banner } = req.body;

  try {
    const newBanner = new Banner({
      banner
    });

    const saveBanner = await newBanner.save();
    res.status(201).json({ message: 'Post created successfully', post: saveBanner });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create post' });
  }
});


app.delete("/banner/:id", async (req, res) => {
  try {

    const bannerDel = await Banner.findByIdAndDelete(req.params.id);

    if (!bannerDel) {
      return res.status(404).send("Data not found");
    }

    if (!req.params.id) {
      res.status(201).send();
    }
  } catch (e) {
    res.status(400).send(e);
  }
})

app.get('/asset', async (req, res) => {
  try {
    const assets = await Asset.find(); // Sort by createdAt in descending order
    res.status(200).json({ assets });
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve tasks' });
  }
});


app.post('/asset', async (req, res) => {
  const { heading, appIcon, ad, facebook, whatsapp, instagram, twitter, tiktok, youtube, telegram, discord, } = req.body;

  try {
    const newPost = new Asset({
      heading,
      appIcon,
      ad,
      facebook,
      whatsapp,
      instagram,
      twitter,
      tiktok,
      youtube,
      telegram,
      discord,
    });

    const savedPost = await newPost.save();
    res.status(201).json({ message: 'Post created successfully', post: savedPost });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create post' });
  }
});

// app.get('/task/:userId', async (req, res) => {
//   const { userId } = req.params;

//   try {
//     // Fetch all tasks
//     const tasks = await Task.find();

//     // Separate tasks into viewed and not viewed based on whether the user's ID is in the views array
//     const viewedTasks = tasks.filter(task => task.views.includes(userId));
//     const notViewedTasks = tasks.filter(task => !task.views.includes(userId));

//     res.status(200).json({
//       viewedTasks,
//       notViewedTasks,
//     });
//   } catch (error) {
//     res.status(500).json({ error: 'Failed to retrieve tasks' });
//   }
// });

app.delete("/asset/:id", async (req, res) => {
  try {

    const userTask = await Asset.findByIdAndDelete(req.params.id);

    if (!userTask) {
      return res.status(404).send("Data not found");
    }

    if (!req.params.id) {
      res.status(201).send();
    }
  } catch (e) {
    res.status(400).send(e);
  }
})


app.patch('/asset/:id', async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  try {
    const updatedAsset = await Asset.findByIdAndUpdate(
      id,
      { $set: updateData }, // Only update the fields provided in req.body
      { new: true, runValidators: true } // Return the updated document
    );

    if (!updatedAsset) {
      return res.status(404).json({ error: 'Asset not found' });
    }

    res.status(200).json({ message: 'Asset updated successfully', asset: updatedAsset });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update asset' });
  }
});



// GET: Retrieve all tasks in reverse order
app.get('/tasks', async (req, res) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 }); // Sort by createdAt in descending order
    res.status(200).json({ tasks });
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve tasks' });
  }
});


app.post('/task', async (req, res) => {
  const { link, heading, subHeading } = req.body;

  try {
    const newPost = new Task({
      heading,
      subHeading,
      link,
      views: [],
      createdAt: Date.now(),
    });

    const savedPost = await newPost.save();
    res.status(201).json({ message: 'Post created successfully', post: savedPost });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create post' });
  }
});

app.get('/task/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const tasks = await Task.find();
    const viewedTasks = tasks.filter(task => task.views.includes(userId));
    const notViewedTasks = tasks.filter(task => !task.views.includes(userId));

    res.status(200).json({
      viewedTasks,
      notViewedTasks,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve tasks' });
  }
});

app.delete("/task/:id", async (req, res) => {
  try {

    const userTask = await Task.findByIdAndDelete(req.params.id);

    if (!userTask) {
      return res.status(404).send("Data not found");
    }

    if (!req.params.id) {
      res.status(201).send();
    }
  } catch (e) {
    res.status(400).send(e);
  }
})


app.put('/task/:postId', async (req, res) => {
  const { postId } = req.params;
  const { userId } = req.body;
  // const { title, content } = req.body;

  try {
    const post = await Task.findById(postId);

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    if (!post.views.includes(userId)) {
      post.views.push(userId);
    }

    const updatedPost = await post.save();
    res.status(200).json({ message: 'Post updated successfully', post: updatedPost });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update post' });
  }
});


app.get('/register/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const adminId = await AdminRegister.findById(id);
    res.json(adminId);
  } catch (error) {
    console.error('Error fetching farm', error);
    res.status(500).send('Internal Server Error');
  }
});

//update Register
app.patch("/register/:email", async (req, res) => {
  try {
    const { email } = req.params;
    let updateData = req.body;

    if (updateData.password) {
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(updateData.password, saltRounds);
      updateData.password = hashedPassword;
    }

    const updatedUser = await AdminRegister.findOneAndUpdate({ email }, updateData, {
      new: true,
    });

    if (!updatedUser) {
      return res.status(404).send({ message: "User not found" });
    }

    res.send(updatedUser);
  } catch (e) {
    res.status(400).send({ message: "Error updating user", error: e });
  }
});


// PATCH route to add coins to an admin's existing coin balance

app.patch('/register/:id/add-coins', async (req, res) => {
  const _id = req.params.id;
  const { additionalCoins } = req.body;

  if (typeof additionalCoins !== 'number') {
    return res.status(400).json({ error: 'additionalCoins must be a number' });
  }

  try {
    const result = await AdminRegister.findByIdAndUpdate(
      _id,
      { $inc: { coin: additionalCoins } },
      { new: true }
    );

    if (result) {
      res.json({ message: 'Coins added successfully', updatedAdmin: result });
    } else {
      res.status(404).json({ error: 'Admin with the given ID not found' });
    }
  } catch (error) {
    console.error("Error adding coins:", error);
    res.status(500).json({ error: 'An error occurred while adding coins' });
  }
});

app.patch('/register/:id/add-nfuc', async (req, res) => {
  const _id = req.params.id;
  const { additionalCoins, accType } = req.body;

  // Validate that additionalCoins is a number
  if (typeof additionalCoins !== 'number') {
    return res.status(400).json({ error: 'additionalCoins must be a number' });
  }

  try {
    // Build the update object dynamically
    const updateData = {
      $inc: { nfuc: additionalCoins }, // Increment the nfuc field
    };

    // If accType is provided, add it to the update object
    if (accType) {
      updateData.$set = { accType: accType }; // Set the accType if provided
    }

    // Perform the update
    const result = await AdminRegister.findByIdAndUpdate(
      _id,
      updateData,
      { new: true } // Return the updated document
    );

    if (result) {
      res.json({ message: 'Coins added successfully', updatedAdmin: result });
    } else {
      res.status(404).json({ error: 'Admin with the given ID not found' });
    }
  } catch (error) {
    console.error("Error adding coins:", error);
    res.status(500).json({ error: 'An error occurred while adding coins' });
  }
});


app.patch('/attempts/:id', async (req, res) => {

  const _id = req.params.id;
  const { attempt, date } = req.body;

  if (typeof attempt !== 'number') {
    return res.status(400).json({ error: 'additionalCoins must be a number' });
  }

  try {
    const result = await AdminRegister.findByIdAndUpdate(
      _id,
      { attempts: attempt, date: date },
      { new: true } // Return the updated document
    );

    if (result) {
      res.json({ message: 'Coins added successfully', updatedAdmin: result });
    } else {
      res.status(404).json({ error: 'Admin with the given ID not found' });
    }
  } catch (error) {
    console.error("Error adding coins:", error);
    res.status(500).json({ error: 'An error occurred while adding coins' });
  }
});

// PATCH route to add coins to an referCoins existing coin balance
app.patch('/register/generated/:generatedId/refer-coins', async (req, res) => {
  const { generatedId } = req.params;
  const { referCoins } = req.body;

  if (typeof referCoins !== 'number') {
    return res.status(400).json({ error: 'referCoins must be a number' });
  }

  try {
    const result = await AdminRegister.findOneAndUpdate(
      { generatedId: generatedId }, // Find by custom `generatedId` field
      { $inc: { referCoin: referCoins } }, // Increment the referCoin field
      { new: true } // Return the updated document
    );

    if (result) {
      res.json({ message: 'Refer coins added successfully', updatedAdmin: result });
    } else {
      res.status(404).json({ error: 'Admin with the given generated ID not found' });
    }
  } catch (error) {
    console.error("Error adding refer coins:", error);
    res.status(500).json({ error: 'An error occurred while adding refer coins' });
  }
});


// PATCH route to add coins to an referCoins existing coin balance
app.patch('/register/generated/:generatedId/refer-nfuc', async (req, res) => {

  const { generatedId } = req.params;
  const { nfucRefer } = req.body;

  if (typeof nfucRefer !== 'number') {
    return res.status(400).json({ error: 'referCoins must be a number' });
  }

  try {
    const result = await AdminRegister.findOneAndUpdate(
      { generatedId: generatedId }, // Find by custom `generatedId` field
      { $inc: { nfucRefer: nfucRefer } }, // Increment the referCoin field
      { new: true } // Return the updated document
    );


    if (result) {
      res.json({ message: 'Refer coins added successfully', updatedAdmin: result });
    } else {
      res.status(404).json({ error: 'Admin with the given generated ID not found' });
    }
  } catch (error) {
    console.error("Error adding refer coins:", error);
    res.status(500).json({ error: 'An error occurred while adding refer coins' });
  }
});

app.patch('/register/transfer-nfuc', async (req, res) => {
  const { senderId, receiverId, amount } = req.body;

  // Validate input
  if (typeof amount !== 'number' || amount <= 0) {
    return res.status(400).json({ error: 'Amount must be a positive number' });
  }

  try {
    // Start a transaction-like process
    const session = await AdminRegister.startSession();
    session.startTransaction();

    try {
      // Decrement coins from the sender
      const senderUpdate = await AdminRegister.findOneAndUpdate(
        { generatedId: senderId },
        { $inc: { nfuc: -amount } },
        { new: true } // Use the session
      );

      if (!senderUpdate) {
        throw new Error('Sender with the given ID not found');
      }

      if (senderUpdate.nfuc < 0) {
        throw new Error('Sender does not have enough coins');
      }

      // Increment coins for the receiver
      const receiverUpdate = await AdminRegister.findOneAndUpdate(
        { generatedId: receiverId },
        { $inc: { nfuc: amount } },
        { new: true } // Use the session
      );

      if (!receiverUpdate) {
        throw new Error('Receiver with the given ID not found');
      }

      // Commit the transaction
      await session.commitTransaction();
      session.endSession();

      res.json({
        message: `Transfer successful ${senderId}, ${receiverId}`,
        sender: senderUpdate,
        receiver: receiverUpdate,
      });
    } catch (transactionError) {
      // Abort the transaction in case of an error
      await session.abortTransaction();
      session.endSession();
      console.error('Transaction failed:', transactionError);
      res.status(400).json({ error: transactionError.message });
    }
  } catch (error) {
    console.error('Error during transfer:', error);
    res.status(500).json({ error: 'An error occurred during the transfer process' });
  }
});



app.post("/register", async (req, res) => {
  try {
    console.log('Received request body:', req.body);
    const { email, name, phone, userId, password } = req.body;

    // Validation: Ensure all required fields are provided

    if (!name || !phone || !email || !password) {
      return res.status(400).json({ msg: 'All fields are mandatory' });
    }

    // Check if email already exists
    const existingUser = await AdminRegister.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: 'Email already exists' });
    }

    const generatedId = await generateUniqueId();
    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);


    // Create a new user and save to the database
    const user = new AdminRegister({
      name,
      phone,
      email,
      generatedId: generatedId.toString(),
      userId,
      password: hashedPassword,
    });
    await user.save();

    res.status(201).json({
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
    });

    console.log('User registered successfully:', user);

  } catch (e) {
    console.error('Error during registration:', e);
    res.status(500).json({ msg: 'Server error. Please try again later.' });
  }
});


app.post("/login", async (req, res) => {

  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ msg: 'Please enter all fields' });
    }

    const user = await AdminRegister.findOne({ email });
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }
    res.json({ user: { id: user._id, name: user.name, email: user.email, userId: user.userId, generatedId: user.generatedId } });
  } catch (e) {
    res.status(400).send(e);
  }
});


app.delete("/login/:id", async (req, res) => {
  try {

    const user = await uploadLogin.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).send("Data not found");
    }

    if (!req.params.id) {
      res.status(201).send();
    }
  } catch (e) {
    res.status(400).send(e);
  }
})


app.patch("/login/:id", async (req, res) => {
  try {
    const _id = req.params.id;
    const updateCategory = await uploadLogin.findByIdAndUpdate(_id, req.body, {
      new: true
    });
    res.send(updateCategory);
  }
  catch (e) {
    res.status(400).send(e);
  }
});


app.get('/register', async (req, res) => {
  try {
    const admin = await AdminRegister.find();
    res.json(admin);
  } catch (error) {
    console.error('Error fetching farms', error);
    res.status(500).send('Internal Server Error');
  }
});

// GET farm by id
app.get('/farm/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const farmId = await Farm.findById(id);
    res.json(farmId);
  } catch (error) {
    console.error('Error fetching farm', error);
    res.status(500).send('Internal Server Error');
  }
});

// GET farm by email
app.get('/farm/email/:email', async (req, res) => {
  try {
    const { email } = req.params;
    const farms = await Farm.find({ email: email });
    res.json(farms);
  } catch (error) {
    console.error('Error fetching farm', error);
    res.status(500).send('Internal Server Error');
  }
});

// POST create farm
app.post('/farm', async (req, res) => {
  try {
    const { email, farm, date } = req.body;
    const newFarm = new Farm({ email, farm, date });
    await newFarm.save();
    res.status(201).json(newFarm);
  } catch (error) {
    console.error('Error creating farm', error);
    res.status(500).send('Internal Server Error');
  }
});

//update Farm
app.patch("/farm/:id", async (req, res) => {
  try {
    const _id = req.params.id;
    const updateFarm = await Farm.findByIdAndUpdate(_id, req.body, {
      new: true
    });
    res.send(updateFarm);
  }
  catch (e) {
    res.status(400).send(e);
  }
});

// DELETE farm
app.delete('/farm/:id', async (req, res) => {
  try {
    const _id = req.params.id;
    const user = await Farm.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).send("Data not found");
    }

    if (!req.params.id) {
      res.status(201).send();
    }
  } catch (e) {
    res.status(400).send(e);
  }
})

app.delete('/farm', async (req, res) => {
  try {
    const { farm } = req.body;
    const deletedFarm = await Farm.findOneAndDelete(farm);
    if (!deletedFarm) {
      res.status(404).json({ message: 'Record not found' });
    } else {
      res.json({ message: 'Record deleted successfully' });
    }
  } catch (error) {
    console.error('Error deleting farm', error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/variety', async (req, res) => {
  try {
    const varieties = await Variety.find();
    res.json(varieties);
  } catch (error) {
    console.error('Error fetching varieties', error);
    res.status(500).send('Internal Server Error');
  }
});

// GET variety by email
app.get('/variety/:email', async (req, res) => {
  try {
    const { email } = req.params;
    const varieties = await Variety.find({ email: email });
    res.json(varieties);
  } catch (error) {
    console.error('Error fetching variety', error);
    res.status(500).send('Internal Server Error');
  }
});

// POST create variety
app.post('/variety', async (req, res) => {
  try {
    const { email, variety, date } = req.body;
    const newVariety = new Variety({ email, variety, date });
    await newVariety.save();
    res.status(201).json(newVariety);
  } catch (error) {
    console.error('Error creating variety', error);
    res.status(500).send('Internal Server Error');
  }
});

// DELETE variety
app.delete('/variety/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedVariety = await Variety.findByIdAndDelete(id);
    if (!deletedVariety) {
      res.status(404).json({ message: 'Record not found' });
    } else {
      res.json({ message: 'Record deleted successfully' });
    }
  } catch (error) {
    console.error('Error deleting variety', error);
    res.status(500).send('Internal Server Error');
  }
});

//update variety
app.patch("/variety/:id", async (req, res) => {
  try {
    const _id = req.params.id;
    const updateVariety = await Variety.findByIdAndUpdate(_id, req.body, {
      new: true
    });
    res.send(updateVariety);
  }
  catch (e) {
    res.status(400).send(e);
  }
});

app.get('/plot', async (req, res) => {
  try {
    const plots = await Plot.find();
    res.json(plots);
  } catch (error) {
    console.error('Error executing query', error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/plot/:email', async (req, res) => {
  try {
    const { email } = req.params;
    const plots = await Plot.find({ email: email });
    res.json(plots);
  } catch (error) {
    console.error('Error executing query', error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/plot/:email/:farm/:block/:plot', async (req, res) => {
  try {
    const { email, farm, block, plot } = req.params;
    const plots = await Plot.findOne({ email: email, farm: farm, block: block, plot: plot });
    res.json(plot);
  } catch (error) {
    console.error('Error executing query', error);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/plot', async (req, res) => {
  try {
    const { farm, block, plot, area, season, rowspace, variety, email, date } = req.body;
    const newPlot = new Plot({ farm, block, plot, area, season, rowspace, variety, email, date });
    await newPlot.save();
    res.json(newPlot);
  } catch (error) {
    console.error('Error executing query', error);
    res.status(500).send('Internal Server Error');
  }
});

// DELETE plot
app.delete('/plot/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedPlot = await Plot.findByIdAndDelete(id);
    if (!deletedPlot) {
      res.status(404).json({ message: 'Record not found' });
    } else {
      res.json({ message: 'Record deleted successfully' });
    }
  } catch (error) {
    console.error('Error deleting variety', error);
    res.status(500).send('Internal Server Error');
  }
});

// Update job
app.patch("/plot/:id", async (req, res) => {
  try {
    const _id = req.params.id;
    const updatePlot = await Plot.findByIdAndUpdate(_id, req.body, {
      new: true
    });
    res.send(updatePlot);
  }
  catch (e) {
    res.status(400).send(e);
  }
});

// GET all ScreenShots
app.get('/screenshot', async (req, res) => {
  try {
    const screenshot = await ScreenShot.find();
    res.json(screenshot);
  } catch (error) {
    console.error('Error fetching screenshot', error);
    res.status(500).send('Internal Server Error');
  }
});

// POST create screenshot
app.post('/screenshot', async (req, res) => {
  try {
    const { image1, image2, payerId, referId, coins, price, type, verify } = req.body;

    if (!image1 || !image2) {
      return res.status(400).json({ error: 'screenshot and image URL are required.' });
    }

    const newScreenShot = new ScreenShot({ image1, image2, payerId, referId, coins, price, type, verify });
    await newScreenShot.save();
    res.status(201).json(newScreenShot);
  } catch (error) {
    console.error('Error creating screenshot:', error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
});

// DELETE screenshot
app.delete('/screenshot/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedScreenshot = await Category.findByIdAndDelete(id);
    if (!deletedScreenshot) {
      res.status(404).json({ message: 'screenshot not found' });
    } else {
      res.json({ message: 'screenshot deleted successfully' });
    }
  } catch (error) {
    console.error('Error deleting screenshot', error);
    res.status(500).send('Internal Server Error');
  }
});

app.patch("/screenshot/:id", async (req, res) => {
  try {
    const _id = req.params.id;
    const updatescreenshot = await Category.findByIdAndUpdate(_id, req.body, {
      new: true
    });
    res.send(updatescreenshot);
  }
  catch (e) {
    res.status(400).send(e);
  }
});

// GET all categories
app.get('/category', async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (error) {
    console.error('Error fetching categories', error);
    res.status(500).send('Internal Server Error');
  }
});

// GET categories by email
app.get('/category/:email', async (req, res) => {
  try {
    const { email } = req.params;
    const categories = await Category.find({ email: email });
    res.json(categories);
  } catch (error) {
    console.error('Error fetching categories by email', error);
    res.status(500).send('Internal Server Error');
  }
});

// POST create category
app.post('/category', async (req, res) => {
  try {
    const { imageUrl, category } = req.body;

    // Check if category or imageUrl is missing
    if (!category || !imageUrl) {
      return res.status(400).json({ error: 'Category and image URL are required.' });
    }

    const newCategory = new Category({ imageUrl, category });
    await newCategory.save();
    res.status(201).json(newCategory);
  } catch (error) {
    console.error('Error creating category:', error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
});

// DELETE category
app.delete('/category/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedCategory = await Category.findByIdAndDelete(id);
    if (!deletedCategory) {
      res.status(404).json({ message: 'Category not found' });
    } else {
      res.json({ message: 'Category deleted successfully' });
    }
  } catch (error) {
    console.error('Error deleting category', error);
    res.status(500).send('Internal Server Error');
  }
});

// Update Category
app.patch("/category/:id", async (req, res) => {
  try {
    const _id = req.params.id;
    const updateCategory = await Category.findByIdAndUpdate(_id, req.body, {
      new: true
    });
    res.send(updateCategory);
  }
  catch (e) {
    res.status(400).send(e);
  }
});

app.get('/product', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    console.error('Error fetching products', error);
    res.status(500).send('Internal Server Error');
  }
});


app.get('/product/:farm', async (req, res) => {
  try {
    const { farm } = req.params;
    const products = await Product.find({ farm: farm });
    res.json(products);
  } catch (error) {
    console.error('Error fetching products', error);
    res.status(500).send('Internal Server Error');
  }
});

// POST create product
app.post('/product', async (req, res) => {
  try {
    const { email, category, product, qty, unit, date, farm } = req.body;
    const newProduct = new Product({ email, category, product, qty, unit, date, farm });
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    console.error('Error creating product', error);
    res.status(500).send('Internal Server Error');
  }
});

app.delete('/product/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedProduct = await Product.findByIdAndDelete(id);
    if (!deletedProduct) {
      res.status(404).json({ message: 'Category not found' });
    } else {
      res.json({ message: 'Category deleted successfully' });
    }
  } catch (error) {
    console.error('Error deleting category', error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/productcreate/:farm', async (req, res) => {
  try {
    const { farm } = req.params;
    const productcreate = await ProductCreate.find({ farm: farm });
    res.json(productcreate);
  } catch (error) {
    console.error('Error fetching products', error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/productcreate', async (req, res) => {
  try {
    const productcreate = await ProductCreate.find();
    res.json(productcreate);
  } catch (error) {
    console.error('Error fetching products', error);
    res.status(500).send('Internal Server Error');
  }
});



// POST create product
app.post('/productcreate', async (req, res) => {
  try {
    const { imageUrl, category, product, price } = req.body;
    const newProduct = new ProductCreate({ imageUrl, category, product, price });
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    console.error('Error creating product', error);
    res.status(500).send('Internal Server Error');
  }
});

app.patch("/productcreate/:id", async (req, res) => {
  try {
    const _id = req.params.id;
    const updateProduct = await ProductCreate.findByIdAndUpdate(_id, req.body, {
      new: true
    });
    res.send(updateProduct);
  }
  catch (e) {
    res.status(400).send(e);
  }
});

app.delete('/productcreate/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedProduct = await ProductCreate.findByIdAndDelete(id);
    if (!deletedProduct) {
      res.status(404).json({ message: 'Category not found' });
    } else {
      res.json({ message: 'Category deleted successfully' });
    }
  } catch (error) {
    console.error('Error deleting category', error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/implements', async (req, res) => {
  try {
    const implementsList = await Implements.find();
    res.json(implementsList);
  } catch (error) {
    console.error('Error fetching implements', error);
    res.status(500).send('Internal Server Error');
  }
});

// GET implements by email
app.get('/implements/:email', async (req, res) => {
  try {
    const { email } = req.params;
    const implementsList = await Implements.find({ email: email });
    res.json(implementsList);
  } catch (error) {
    console.error('Error fetching implements by email', error);
    res.status(500).send('Internal Server Error');
  }
});

// POST create implement
app.post('/implements', async (req, res) => {
  try {
    const { id, email, name, date, stageid, stage } = req.body;
    const newImplement = new Implements({ id, email, name, date, stageid, stage });
    await newImplement.save();
    res.status(201).json(newImplement);
  } catch (error) {
    console.error('Error creating implement', error);
    res.status(500).send('Internal Server Error');
  }
});

// DELETE implement
app.delete('/implements/:email/:name/:id', async (req, res) => {
  try {
    const { email, name, id } = req.params;
    const deletedImplement = await Implements.findOneAndDelete({ email: email, name: name, id: id });
    if (!deletedImplement) {
      res.status(404).json({ message: 'Implement not found' });
    } else {
      res.json({ message: 'Implement deleted successfully' });
    }
  } catch (error) {
    console.error('Error deleting implement', error);
    res.status(500).send('Internal Server Error');
  }
});

// PATCH update implement
app.patch('/implements', async (req, res) => {
  try {
    const { id, email, name } = req.body;
    const updatedImplement = await Implements.findOneAndUpdate(
      { email: email, id: id },
      { $set: { name: name } },
      { new: true }
    );
    res.json(updatedImplement);
  } catch (error) {
    console.error('Error updating implement', error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/irrigationsr', async (req, res) => {
  try {
    const irrigationsrList = await Irrigationsr.find();
    res.json(irrigationsrList);
  } catch (error) {
    console.error('Error fetching irrigationsr', error);
    res.status(500).send('Internal Server Error');
  }
});

// GET irrigationsr by email
app.get('/irrigationsr/:email', async (req, res) => {
  try {
    const { email } = req.params;
    const irrigationsrList = await Irrigationsr.find({ email: email });
    res.json(irrigationsrList);
  } catch (error) {
    console.error('Error fetching irrigationsr by email', error);
    res.status(500).send('Internal Server Error');
  }
});

// POST create irrigationsr
app.post('/irrigationsr', async (req, res) => {
  try {
    const { id, email, source, date } = req.body;
    const newIrrigationsr = new Irrigationsr({ id, email, source, date });
    await newIrrigationsr.save();
    res.status(201).json(newIrrigationsr);
  } catch (error) {
    console.error('Error creating irrigationsr', error);
    res.status(500).send('Internal Server Error');
  }
});

// DELETE irrigationsr
app.delete('/irrigationsr/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedIrrigationsr = await Irrigationsr.findByIdAndDelete(id);
    if (!deletedIrrigationsr) {
      res.status(404).json({ message: 'Category not found' });
    } else {
      res.json({ message: 'Category deleted successfully' });
    }
  } catch (error) {
    console.error('Error deleting category', error);
    res.status(500).send('Internal Server Error');
  }
});

// PATCH update irrigationsr
app.patch("/irrigationsr/:id", async (req, res) => {
  try {
    const _id = req.params.id;
    const updateIrrigationsr = await Irrigationsr.findByIdAndUpdate(_id, req.body, {
      new: true
    });
    res.send(updateIrrigationsr);
  }
  catch (e) {
    res.status(400).send(e);
  }
});

// GET all job
app.get('/job', async (req, res) => {
  try {
    const jobList = await Job.find();
    res.json(jobList);
  } catch (error) {
    console.error('Error fetching job', error);
    res.status(500).send('Internal Server Error');
  }
});

// GET job by email
app.get('/job/:email', async (req, res) => {
  try {
    const { email } = req.params;
    const jobList = await Job.find({ email: email });
    res.json(jobList);
  } catch (error) {
    console.error('Error fetching job by email', error);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/job', async (req, res) => {
  try {
    const { email, job, date } = req.body;
    const newJob = new Job({ email, job, date });
    await newJob.save();
    res.status(201).json(newJob);
  } catch (error) {
    console.error('Error creating irrigationsr', error);
    res.status(500).send('Internal Server Error');
  }
});

// DELETE job
app.delete('/job/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedJob = await Job.findByIdAndDelete(id);
    if (!deletedJob) {
      res.status(404).json({ message: 'Record not found' });
    } else {
      res.json({ message: 'Record deleted successfully' });
    }
  } catch (error) {
    console.error('Error deleting variety', error);
    res.status(500).send('Internal Server Error');
  }
});

// Update job
app.patch("/job/:id", async (req, res) => {
  try {
    const _id = req.params.id;
    const updateJob = await Job.findByIdAndUpdate(_id, req.body, {
      new: true
    });
    res.send(updateJob);
  }
  catch (e) {
    res.status(400).send(e);
  }
});

app.get('/dailyentry/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const getentries = await DailyEntry.findById(id);
    res.json(getentries);
  } catch (error) {
    console.error('Error fetching daily entries', error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/dailyentry/:date', async (req, res) => {
  try {
    const { date } = req.params;
    const decodedDate = decodeURIComponent(date);
    console.log(`Fetching entries for date: ${decodedDate}`);
    const entries = await DailyEntry.find({ date: decodedDate });
    console.log(`Entries found: ${entries.length}`);
    res.json(entries);
  } catch (error) {
    console.error('Error fetching daily entries:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/dailyentry', async (req, res) => {
  try {
    const entries = await DailyEntry.find().sort({ _id: -1 });
    res.json(entries);
  } catch (error) {
    console.error('Error fetching daily entries', error);
    res.status(500).send('Internal Server Error');
  }
});

// POST create daily entry
app.post('/dailyentry', async (req, res) => {
  try {
    const { id, farm, plot, season, area, stage, type, deal, time, mean, fuel, person, quantity, moga, units, email, date, year } = req.body;
    const newEntry = new DailyEntry({ id, farm, plot, season, area, stage, type, deal, time, mean, fuel, person, quantity, moga, units, email, date, year });
    await newEntry.save();
    res.status(201).json(newEntry);
  } catch (error) {
    console.error('Error creating daily entry', error);
    res.status(500).send('Internal Server Error');
  }
});

// DELETE daily entry
app.delete('/dailyentry/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deleteddailyentry = await DailyEntry.findByIdAndDelete(id);
    if (!deleteddailyentry) {
      res.status(404).json({ message: 'Record not found' });
    } else {
      res.json({ message: 'Record deleted successfully' });
    }
  } catch (error) {
    console.error('Error deleting variety', error);
    res.status(500).send('Internal Server Error');
  }
});

// PATCH update daily entry
app.patch("/dailyentry/:id", async (req, res) => {
  try {
    const _id = req.params.id;
    const updatedailyentry = await DailyEntry.findByIdAndUpdate(_id, req.body, {
      new: true
    });
    res.send(updatedailyentry);
  }
  catch (e) {
    res.status(400).send(e);
  }
});


app.get('/vehicle', async (req, res) => {
  try {
    const vehicles = await Vehicle.find();
    res.json(vehicles);
  } catch (error) {
    console.error('Error fetching vehicles', error);
    res.status(500).send('Internal Server Error');
  }
});

// GET vehicles by email
app.get('/vehicle/:email', async (req, res) => {
  try {
    const { email } = req.params;
    const vehicles = await Vehicle.find({ email: email });
    res.json(vehicles);
  } catch (error) {
    console.error('Error fetching vehicles by email', error);
    res.status(500).send('Internal Server Error');
  }
});

// POST create vehicle
app.post('/vehicle', async (req, res) => {
  try {
    const { email, vehicle, date } = req.body;
    const newVehicle = new Vehicle({ email, vehicle, date });
    await newVehicle.save();
    res.status(201).json(newVehicle);
  } catch (error) {
    console.error('Error creating vehicle', error);
    res.status(500).send('Internal Server Error');
  }
});

// DELETE vehicle
app.delete('/vehicle', async (req, res) => {
  try {
    const { email, vehicle } = req.body;
    const deletedVehicle = await Vehicle.findOneAndDelete({ email: email, vehicle: vehicle });
    if (!deletedVehicle) {
      res.status(404).json({ message: 'Vehicle not found' });
    } else {
      res.json({ message: 'Vehicle deleted successfully' });
    }
  } catch (error) {
    console.error('Error deleting vehicle', error);
    res.status(500).send('Internal Server Error');
  }
});


app.get('/financialseason', async (req, res) => {
  try {
    const financialseason = await FinancialSeason.find();
    res.json(financialseason);
  } catch (error) {
    console.error('Error fetching farms', error);
    res.status(500).send('Internal Server Error');
  }
});

// GET financialseason by email
app.get('/financialseason/:email', async (req, res) => {
  try {
    const { email } = req.params;
    const financialseason = await FinancialSeason.find({ email: email });
    res.json(financialseason);
  } catch (error) {
    console.error('Error fetching farm', error);
    res.status(500).send('Internal Server Error');
  }
});

// POST create financialseason
app.post('/financialseason', async (req, res) => {
  try {
    const { email, year, date } = req.body;
    const financialseason = new FinancialSeason({ email, year, date });
    await financialseason.save();
    res.status(201).json(financialseason);
  } catch (error) {
    console.error('Error creating farm', error);
    res.status(500).send('Internal Server Error');
  }
});

// DELETE financialseason
app.delete('/financialseason/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedfinancialseason = await FinancialSeason.findByIdAndDelete(id);
    if (!deletedfinancialseason) {
      res.status(404).json({ message: 'Record not found' });
    } else {
      res.json({ message: 'Record deleted successfully' });
    }
  } catch (error) {
    console.error('Error deleting farm', error);
    res.status(500).send('Internal Server Error');
  }
});


app.get('/fuel', async (req, res) => {
  try {
    const fuel = await Fuel.find();
    res.json(fuel);
  } catch (error) {
    console.error('Error fetching farms', error);
    res.status(500).send('Internal Server Error');
  }
});


// GET farm by farm
app.get('/fuel/:farm', async (req, res) => {
  try {
    const { farm } = req.params;
    const fuel = await Fuel.find({ farm: farm });
    res.json(fuel);
  } catch (error) {
    console.error('Error fetching farm', error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/fuel/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const fuel = await Fuel.findById(id);
    res.json(fuel);
  } catch (error) {
    console.error('Error fetching farm', error);
    res.status(500).send('Internal Server Error');
  }
});

// POST create farm
app.post('/fuel', async (req, res) => {
  try {
    const { email, fuelAmount, date } = req.body;
    const fuel = new Fuel({ email, fuelAmount, date });
    await fuel.save();
    res.status(201).json(fuel);
  } catch (error) {
    console.error('Error creating farm', error);
    res.status(500).send('Internal Server Error');
  }
});

app.delete('/fuel', async (req, res) => {
  try {
    const { fuel } = req.body;
    const deletedfuel = await Fuel.findOneAndDelete(fuel);
    if (!deletedfuel) {
      res.status(404).json({ message: 'Record not found' });
    } else {
      res.json({ message: 'Record deleted successfully' });
    }
  } catch (error) {
    console.error('Error deleting farm', error);
    res.status(500).send('Internal Server Error');
  }
});

app.delete('/fuel/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedfuel = await Fuel.findByIdAndDelete(id);
    if (!deletedfuel) {
      res.status(404).json({ message: 'Record not found' });
    } else {
      res.json({ message: 'Record deleted successfully' });
    }
  } catch (error) {
    console.error('Error deleting farm', error);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

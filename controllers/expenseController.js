const Expense = require('../models/Expense');
const User = require('../models/User');
const { splitEqual, splitExact, splitPercentage } = require('../utils/splitMethods');

exports.calculateSplit = async (req, res) => {
  const { description, amount, splitType, participants, amounts, percentages } = req.body;

  if (!description || !amount || !splitType || !participants || participants.length === 0) {
    return res.status(400).json({ message: 'Description, total amount, split type, and participants are required' });
  }

  try {
    // Fetch user IDs by names
    const users = await User.find({ name: { $in: participants } });

    if (users.length !== participants.length) {
      return res.status(400).json({ message: 'One or more participants are not found in the database' });
    }

    const userIDs = users.map(user => user._id);

    let result;

    switch (splitType) {
      case 'equal':
        result = splitEqual(amount, userIDs);
        break;
      case 'exact':
        if (!amounts || amounts.length !== participants.length) {
          return res.status(400).json({ message: 'Exact amounts for each participant are required' });
        }
        result = splitExact(amounts);
        break;
      case 'percentage':
        if (!percentages || percentages.length !== participants.length) {
          return res.status(400).json({ message: 'Percentages for each participant are required' });
        }
        if (percentages.reduce((sum, { percentage }) => sum + percentage, 0) !== 100) {
          return res.status(400).json({ message: 'Percentages must add up to 100%' });
        }
        result = splitPercentage(amount, percentages);
        break;
      default:
        return res.status(400).json({ message: 'Invalid split type' });
    }

    // Store the expense in the database
    const expense = new Expense({
      description,
      amount,
      splitType,
      participants: result.map((r, index) => ({
        user: userIDs[index],
        amount: r.amount
      }))
    });

    await expense.save();
    res.json(expense);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
};


const pdf = require('pdfkit');

//generate balance sheet of an expense with expense id for display
exports.generateBalanceSheet = async (req, res) => {
    const { id } = req.params;
    
    try {
        const expense = await Expense.findById(id).populate('participants.user', 'name');
    
        if (!expense) {
            return res.status(404).json({ message: 'Expense not found' });
        }
    
        const doc = new pdf();
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename="balance-sheet.pdf"');
        
        doc.pipe(res);
    
        doc.fontSize(20).text(`Expense: ${expense.description}`);
        doc.fontSize(16).text(`Total amount: ${expense.amount}`);
        doc.fontSize(16).text(`Split type: ${expense.splitType}`);
        doc.moveDown();
    
        doc.fontSize(20).text('Participants:');
        doc.moveDown();
    
        expense.participants.forEach(participant => {
            doc.fontSize(16).text(`Name: ${participant.user.name}`);
            console.log(`Participant name: ${participant.user.name}`);
            doc.fontSize(16).text(`Amount: ${participant.amount}`);
            doc.moveDown();
        });
        console.log('PDF generated');
    
        doc.end();
        
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

const path = require('path');
const fs = require('fs');

//download balance sheet of an expense with expense id
exports.downloadBalanceSheet = async (req, res) => {
    const { id } = req.params;

    try {
        const expense = await Expense.findById(id).populate('participants.user', 'name');

        if (!expense) {
            return res.status(404).json({ message: 'Expense not found' });
        }

        const doc = new pdf();
        const filename = `balance-sheet-${expense._id}.pdf`;
        const filePath = path.join(__dirname, '..', 'downloads', filename);

        // Ensure the downloads directory exists
        if (!fs.existsSync(path.join(__dirname, '..', 'downloads'))) {
            fs.mkdirSync(path.join(__dirname, '..', 'downloads'));
        }

        doc.pipe(fs.createWriteStream(filePath)).on('finish', () => {
            res.download(filePath, (err) => {
                if (err) {
                    console.error(err.message);
                    return res.status(500).json({ message: 'Error downloading the file' });
                }

                // Clean up the file after download
                fs.unlinkSync(filePath);
            });
        });

        doc.fontSize(20).text(`Expense: ${expense.description}`);
        doc.fontSize(16).text(`Total amount: ${expense.amount}`);
        doc.fontSize(16).text(`Split type: ${expense.splitType}`);
        doc.moveDown();

        doc.fontSize(20).text('Participants:');
        doc.moveDown();

        expense.participants.forEach(participant => {
            doc.fontSize(16).text(`Name: ${participant.user.name}`);
            console.log(`Participant name: ${participant.user.name}`);
            doc.fontSize(16).text(`Amount: ${participant.amount}`);
            doc.moveDown();
        });

        doc.end();
        console.log('PDF generated and saved to downloads folder');
        
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

//retrieve individual expenses of participants with expense id
exports.getIndividualExpenses = async (req, res) => {
    const { id } = req.params;

    try {
        const expense = await Expense.findById(id).populate('participants.user', 'name');

        if (!expense) {
            return res.status(404).json({ message: 'Expense not found' });
        }

        //store individual expenses in a json object
        const individualExpenses = {"description": expense.description, "totalAmount": expense.amount};
        expense.participants.forEach(participant => {
            individualExpenses[participant.user.name] = participant.amount;
        });

        res.status(200).json(individualExpenses);

    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

//retrieve total expense of an expense with expense id
exports.getTotalExpense = async (req, res) => {
    const { id } = req.params;

    try {
        const expense = await Expense.findById(id);

        if (!expense) {
            return res.status(404).json({ message: 'Expense not found' });
        }

        res.status(200).json({totalAmount: expense.amount});

    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server error' });
    }
};
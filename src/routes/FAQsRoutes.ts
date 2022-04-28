import {Request, response, Response, Router} from 'express';
import FAQ from '../models/FAQs';
import Customer from '../models/Customer';
import config from '../config';


class FAQsRoutes {
    public router: Router;
    constructor() {
        this.router = Router();
        this.routes(); //This has to be written here so that the method can actually be configured when called externally.
    }

    public async getAllFAQs(req: Request, res: Response) : Promise<void> { //It returns a void, but internally it's a promise.
        const allFAQs = await FAQ.find();
        if (allFAQs.length == 0){
            res.status(404).send("There are no FAQs yet.")
        }
        else{
            res.status(200).send(allFAQs);
        }
    }

    public async getFAQbyId(req: Request, res: Response) : Promise<void> {
        const FAQFound = await FAQ.findById(req.params._id).populate('customer');
        if(FAQFound == null){
            res.status(404).send("FAQ not found.");
        }
        else{
            res.status(200).send(FAQFound);
        }
    }

    public async addFAQ(req: Request, res: Response) : Promise<void> {
        const FAQFound = await FAQ.findOne({questionText: req.body.questionText}).populate('customer')
        if (FAQFound != null){
            res.status(409).send("This FAQ already exists.");
            return;
        }
        const customerFound = await Customer.findById({_id: req.body.customer});
        if (customerFound == null){
            res.status(404).send("Customer not found.");
            return;
        }
        const {questionText, answerText, customer, questionPossition} = req.body;
        const newFAQ = new FAQ({questionText, answerText, customer, questionPossition});
        let newFAQID;
        await newFAQ.save().then(FAQ => {
            newFAQID = FAQ._id.toString();
        });
        await Customer.findByIdAndUpdate({_id: req.body.customer}, {$push: {listFAQs: newFAQID}})
        res.status(201).send('FAQ added and Customer updated.');
    
    }

    public async updateFAQ(req: Request, res: Response) : Promise<void> {
        const FAQToUpdate = await FAQ.findByIdAndUpdate (req.params._id, req.body);
        if(FAQToUpdate == null){
            res.status(404).send("FAQ not found.");
        }
        else{
            res.status(201).send("FAQ updated.");
        }
    }

    public async deleteFAQ(req: Request, res: Response) : Promise<void> {
        const FAQToDelete = await FAQ.findByIdAndDelete (req.params._id);
        if (FAQToDelete == null){
            res.status(404).send("FAQ not found.")
        }
        else{
            res.status(200).send('FAQ deleted.');
        }
    } 

    routes() {
        this.router.get('/', this.getAllFAQs);
        this.router.get('/:_id', this.getFAQbyId);
        this.router.post('/', this.addFAQ);
        this.router.put('/:_id', this.updateFAQ);
        this.router.delete('/:_id', this.deleteFAQ);
    }
}
const faqsRoutes = new FAQsRoutes();

export default faqsRoutes.router;


const STORAGE_KEYS = {
    HOLDERS: 'policypro_holders_v1',
    POLICIES: 'policypro_policies_v1',
    PREMIUMS: 'policypro_premiums_v1',
    RENEWALS: 'policypro_renewals_v1',
    CLAIMS: 'policypro_claims_v1',
    COMMS: 'policypro_comms_v1',
    USER: 'policypro_current_user_v1',
    THEME: 'policypro_theme_v1'
};

// Initial Seed Data (Realistic LIC/Indian Insurance Data)
const INITIAL_DATA = {
    users: [
        { id: 'USR-01', name: 'Rajesh Sharma', role: 'Admin', title: 'Senior Branch Administrator', email: 'rajesh.admin@lic-das.in', branch: 'Chennai Central (BR-04)' },
        { id: 'USR-02', name: 'Kavitha Ramachandran', role: 'Manager', title: 'Underwriting & Claims Manager', email: 'kavitha.mgr@lic-das.in', branch: 'Chennai South (BR-07)' },
        { id: 'USR-03', name: 'Suresh Kumar', role: 'Agent', title: 'Chief Life Insurance Advisor (Code: 04829)', email: 'suresh.agent@lic-das.in', branch: 'Chennai Central (BR-04)' }
    ],

    policyHolders: [
        {
            id: 1,
            holderCode: 'PH-1001',
            name: 'Amit Sharma',
            email: 'amit.sharma@example.com',
            phone: '+91 98765 43210',
            address: 'Flat 402, Green Glen Layout, Bellandur',
            city: 'Bengaluru',
            state: 'Karnataka',
            pincode: '560103',
            dob: '1985-05-15',
            gender: 'Male',
            nominee: 'Sunita Sharma',
            nominee_relation: 'Spouse',
            nominee_phone: '+91 98765 43219',
            occupation: 'Software Architect',
            income: 1800000,
            pan: 'ABCPS1234F',
            registered_date: '2022-03-10',
            status: 'Active'
        },
        {
            id: 2,
            holderCode: 'PH-1002',
            name: 'Priya Patel',
            email: 'priya.patel@example.com',
            phone: '+91 98765 43211',
            address: 'B-12 Shivalik Apartments, Bodakdev',
            city: 'Ahmedabad',
            state: 'Gujarat',
            pincode: '380054',
            dob: '1990-08-20',
            gender: 'Female',
            nominee: 'Karan Patel',
            nominee_relation: 'Spouse',
            nominee_phone: '+91 98765 43220',
            occupation: 'Chartered Accountant',
            income: 1400000,
            pan: 'BKMPP9876K',
            registered_date: '2022-07-14',
            status: 'Active'
        },
        {
            id: 3,
            holderCode: 'PH-1003',
            name: 'Vikramaditya Rao',
            email: 'v.rao@example.com',
            phone: '+91 98450 11223',
            address: 'Plot 88, Jubilee Hills Road No. 36',
            city: 'Hyderabad',
            state: 'Telangana',
            pincode: '500033',
            dob: '1978-11-04',
            gender: 'Male',
            nominee: 'Anuradha Rao',
            nominee_relation: 'Spouse',
            nominee_phone: '+91 98450 11224',
            occupation: 'Business Owner',
            income: 3200000,
            pan: 'AAPVR4521L',
            registered_date: '2021-11-05',
            status: 'Active'
        },
        {
            id: 4,
            holderCode: 'PH-1004',
            name: 'Deepika Sundaram',
            email: 'deepika.s@example.com',
            phone: '+91 94441 87654',
            address: '14/2 Harrington Road, Chetpet',
            city: 'Chennai',
            state: 'Tamil Nadu',
            pincode: '600031',
            dob: '1993-02-28',
            gender: 'Female',
            nominee: 'Ramesh Sundaram',
            nominee_relation: 'Parent',
            nominee_phone: '+91 94441 87655',
            occupation: 'Assistant Professor',
            income: 950000,
            pan: 'CRPSD7741P',
            registered_date: '2023-01-18',
            status: 'Active'
        },
        {
            id: 5,
            holderCode: 'PH-1005',
            name: 'Manish Verma',
            email: 'manish.verma@example.com',
            phone: '+91 98112 55443',
            address: 'D-54 Sector 62',
            city: 'Noida',
            state: 'Uttar Pradesh',
            pincode: '201301',
            dob: '1982-09-12',
            gender: 'Male',
            nominee: 'Pooja Verma',
            nominee_relation: 'Spouse',
            nominee_phone: '+91 98112 55449',
            occupation: 'Senior Logistics Consultant',
            income: 1650000,
            pan: 'AZMVX6623Q',
            registered_date: '2023-05-22',
            status: 'Active'
        },
        {
            id: 6,
            holderCode: 'PH-1006',
            name: 'Ananya Sen',
            email: 'ananya.sen@example.com',
            phone: '+91 98300 44556',
            address: '77 Southern Avenue, Ballygunge',
            city: 'Kolkata',
            state: 'West Bengal',
            pincode: '700029',
            dob: '1995-12-03',
            gender: 'Female',
            nominee: 'Subir Sen',
            nominee_relation: 'Parent',
            nominee_phone: '+91 98300 44557',
            occupation: 'Civil Engineer',
            income: 1100000,
            pan: 'DLKAS9921D',
            registered_date: '2023-09-10',
            status: 'Active'
        }
    ],

    policies: [
        {
            id: 1,
            policy_number: 'POL-LIC-1001-A',
            holder_id: 1,
            holder_name: 'Amit Sharma',
            plan_name: 'LIC Jeevan Labh (Plan 936)',
            policy_type: 'Endowment Plan',
            sum_assured: 1500000,
            premium_amount: 54000,
            term: 21,
            premium_term: 15,
            payment_frequency: 'Yearly',
            start_date: '2022-04-01',
            end_date: '2043-04-01',
            next_due_date: '2026-11-15',
            status: 'Active',
            agent_id: 'AG-04829'
        },
        {
            id: 2,
            policy_number: 'POL-LIC-1001-B',
            holder_id: 1,
            holder_name: 'Amit Sharma',
            plan_name: 'LIC Tech Term Pure Risk Shield',
            policy_type: 'Term Insurance',
            sum_assured: 10000000,
            premium_amount: 19800,
            term: 35,
            premium_term: 35,
            payment_frequency: 'Yearly',
            start_date: '2023-01-10',
            end_date: '2058-01-10',
            next_due_date: '2027-01-10',
            status: 'Active',
            agent_id: 'AG-04829'
        },
        {
            id: 3,
            policy_number: 'POL-LIC-1002-A',
            holder_id: 2,
            holder_name: 'Priya Patel',
            plan_name: 'LIC Arogya Rakshak Family Floater',
            policy_type: 'Health Insurance',
            sum_assured: 800000,
            premium_amount: 14200,
            term: 20,
            premium_term: 20,
            payment_frequency: 'Half-Yearly',
            start_date: '2022-08-15',
            end_date: '2042-08-15',
            next_due_date: '2026-11-05',
            status: 'Renewal Due',
            agent_id: 'AG-04829'
        },
        {
            id: 4,
            policy_number: 'POL-LIC-1003-A',
            holder_id: 3,
            holder_name: 'Vikramaditya Rao',
            plan_name: 'LIC Jeevan Umang Whole Life',
            policy_type: 'Endowment Plan',
            sum_assured: 5000000,
            premium_amount: 185000,
            term: 25,
            premium_term: 15,
            payment_frequency: 'Yearly',
            start_date: '2021-12-01',
            end_date: '2046-12-01',
            next_due_date: '2026-12-01',
            status: 'Active',
            agent_id: 'AG-04829'
        },
        {
            id: 5,
            policy_number: 'POL-LIC-1003-B',
            holder_id: 3,
            holder_name: 'Vikramaditya Rao',
            plan_name: 'LIC Money Back Plan 20 Years',
            policy_type: 'Money Back Plan',
            sum_assured: 2500000,
            premium_amount: 92000,
            term: 20,
            premium_term: 15,
            payment_frequency: 'Yearly',
            start_date: '2022-02-15',
            end_date: '2042-02-15',
            next_due_date: '2026-10-20',
            status: 'Renewal Due',
            agent_id: 'AG-04829'
        },
        {
            id: 6,
            policy_number: 'POL-LIC-1004-A',
            holder_id: 4,
            holder_name: 'Deepika Sundaram',
            plan_name: 'LIC Amritbaal Child Higher Education',
            policy_type: 'Child Plan',
            sum_assured: 1200000,
            premium_amount: 32000,
            term: 18,
            premium_term: 10,
            payment_frequency: 'Yearly',
            start_date: '2023-02-01',
            end_date: '2041-02-01',
            next_due_date: '2027-02-01',
            status: 'Active',
            agent_id: 'AG-04829'
        },
        {
            id: 7,
            policy_number: 'POL-LIC-1005-A',
            holder_id: 5,
            holder_name: 'Manish Verma',
            plan_name: 'LIC Saral Pension Guaranteed Annuity',
            policy_type: 'Pension Plan',
            sum_assured: 2000000,
            premium_amount: 68000,
            term: 25,
            premium_term: 20,
            payment_frequency: 'Half-Yearly',
            start_date: '2023-06-01',
            end_date: '2048-06-01',
            next_due_date: '2026-09-15',
            status: 'Lapsed',
            agent_id: 'AG-04829'
        },
        {
            id: 8,
            policy_number: 'POL-LIC-1006-A',
            holder_id: 6,
            holder_name: 'Ananya Sen',
            plan_name: 'LIC Tech Term Platinum',
            policy_type: 'Term Insurance',
            sum_assured: 7500000,
            premium_amount: 13500,
            term: 30,
            premium_term: 30,
            payment_frequency: 'Quarterly',
            start_date: '2023-10-01',
            end_date: '2053-10-01',
            next_due_date: '2026-11-20',
            status: 'Active',
            agent_id: 'AG-04829'
        }
    ],

    premiums: [
        {
            id: 1,
            receipt_no: 'RCP-2026-8801',
            policy_id: 1,
            policy_number: 'POL-LIC-1001-A',
            holder_id: 1,
            holder_name: 'Amit Sharma',
            payment_date: '2025-11-12',
            amount: 54000,
            payment_method: 'UPI',
            transaction_id: 'UPI-ICICI-8991204124',
            status: 'Completed',
            notes: 'Annual renewal premium collected via BHIM UPI'
        },
        {
            id: 2,
            receipt_no: 'RCP-2026-8802',
            policy_id: 2,
            policy_number: 'POL-LIC-1001-B',
            holder_id: 1,
            holder_name: 'Amit Sharma',
            payment_date: '2026-01-08',
            amount: 19800,
            payment_method: 'Net Banking',
            transaction_id: 'HDFC-NB-448291055',
            status: 'Completed',
            notes: 'Pure Term Shield annual renewal payment'
        },
        {
            id: 3,
            receipt_no: 'RCP-2026-8803',
            policy_id: 3,
            policy_number: 'POL-LIC-1002-A',
            holder_id: 2,
            holder_name: 'Priya Patel',
            payment_date: '2026-05-02',
            amount: 14200,
            payment_method: 'Debit Card',
            transaction_id: 'RRN-99214710294',
            status: 'Completed',
            notes: 'Health policy half-yearly instalment'
        },
        {
            id: 4,
            receipt_no: 'RCP-2026-8804',
            policy_id: 4,
            policy_number: 'POL-LIC-1003-A',
            holder_id: 3,
            holder_name: 'Vikramaditya Rao',
            payment_date: '2025-11-28',
            amount: 185000,
            payment_method: 'NEFT/RTGS',
            transaction_id: 'SBI-RTGS-55449911',
            status: 'Completed',
            notes: 'Jeevan Umang high sum assured annual premium'
        },
        {
            id: 5,
            receipt_no: 'RCP-2026-8805',
            policy_id: 6,
            policy_number: 'POL-LIC-1004-A',
            holder_id: 4,
            holder_name: 'Deepika Sundaram',
            payment_date: '2026-01-29',
            amount: 32000,
            payment_method: 'UPI',
            transaction_id: 'GPAY-AXIS-0912448',
            status: 'Completed',
            notes: 'Amritbaal educational plan premium'
        },
        {
            id: 6,
            receipt_no: 'RCP-2026-8806',
            policy_id: 8,
            policy_number: 'POL-LIC-1006-A',
            holder_id: 6,
            holder_name: 'Ananya Sen',
            payment_date: '2026-08-18',
            amount: 13500,
            payment_method: 'Credit Card',
            transaction_id: 'CITI-CC-88291410',
            status: 'Completed',
            notes: 'Quarterly payment processed successfully'
        }
    ],

    renewals: [
        {
            id: 1,
            policy_id: 3,
            policy_number: 'POL-LIC-1002-A',
            holder_id: 2,
            holder_name: 'Priya Patel',
            holder_phone: '+91 98765 43211',
            holder_email: 'priya.patel@example.com',
            renewal_date: '2026-11-05',
            grace_period_end: '2026-12-05',
            premium_due: 14200,
            status: 'Upcoming',
            reminder_sent: true,
            reminder_count: 2,
            last_reminder_date: '2026-10-25'
        },
        {
            id: 2,
            policy_id: 5,
            policy_number: 'POL-LIC-1003-B',
            holder_id: 3,
            holder_name: 'Vikramaditya Rao',
            holder_phone: '+91 98450 11223',
            holder_email: 'v.rao@example.com',
            renewal_date: '2026-10-20',
            grace_period_end: '2026-11-20',
            premium_due: 92000,
            status: 'Due',
            reminder_sent: true,
            reminder_count: 3,
            last_reminder_date: '2026-10-27'
        },
        {
            id: 3,
            policy_id: 1,
            policy_number: 'POL-LIC-1001-A',
            holder_id: 1,
            holder_name: 'Amit Sharma',
            holder_phone: '+91 98765 43210',
            holder_email: 'amit.sharma@example.com',
            renewal_date: '2026-11-15',
            grace_period_end: '2026-12-15',
            premium_due: 54000,
            status: 'Upcoming',
            reminder_sent: false,
            reminder_count: 0,
            last_reminder_date: null
        },
        {
            id: 4,
            policy_id: 7,
            policy_number: 'POL-LIC-1005-A',
            holder_id: 5,
            holder_name: 'Manish Verma',
            holder_phone: '+91 98112 55443',
            holder_email: 'manish.verma@example.com',
            renewal_date: '2026-09-15',
            grace_period_end: '2026-10-15',
            premium_due: 68000,
            status: 'Overdue',
            reminder_sent: true,
            reminder_count: 4,
            last_reminder_date: '2026-10-18'
        },
        {
            id: 5,
            policy_id: 8,
            policy_number: 'POL-LIC-1006-A',
            holder_id: 6,
            holder_name: 'Ananya Sen',
            holder_phone: '+91 98300 44556',
            holder_email: 'ananya.sen@example.com',
            renewal_date: '2026-11-20',
            grace_period_end: '2026-12-20',
            premium_due: 13500,
            status: 'Upcoming',
            reminder_sent: false,
            reminder_count: 0,
            last_reminder_date: null
        }
    ],

    claims: [
        {
            id: 1,
            claim_number: 'CLM-2026-041',
            policy_id: 3,
            policy_number: 'POL-LIC-1002-A',
            holder_id: 2,
            holder_name: 'Priya Patel',
            claim_type: 'Hospitalization Reimbursement',
            claim_date: '2026-09-14',
            incident_date: '2026-09-02',
            amount: 85000,
            status: 'Approved',
            description: 'Emergency gallbladder laparoscopy at Apollo Hospital Ahmedabad. All pre/post hospitalization bills verified.',
            documents: ['Hospital_Discharge_Summary.pdf', 'Final_Bill_Apollo.pdf', 'Doctor_Prescription.pdf'],
            settlement_date: '2026-09-28',
            investigator_notes: 'Claim verified by Third Party Administrator (TPA). Final payout sanctioned for ₹85,000.'
        },
        {
            id: 2,
            claim_number: 'CLM-2026-078',
            policy_id: 5,
            policy_number: 'POL-LIC-1003-B',
            holder_id: 3,
            holder_name: 'Vikramaditya Rao',
            claim_type: 'Survival Benefit',
            claim_date: '2026-10-05',
            incident_date: '2026-10-01',
            amount: 375000,
            status: 'Under Investigation',
            description: 'Survival benefit payout due at completion of 4th policy year under Money Back terms (15% of Sum Assured).',
            documents: ['Survival_Benefit_Form.pdf', 'Original_Policy_Bond.pdf', 'Bank_Cancelled_Cheque.pdf'],
            settlement_date: null,
            investigator_notes: 'Under review by branch accounts officer. Policy active and KYC verified.'
        },
        {
            id: 3,
            claim_number: 'CLM-2026-092',
            policy_id: 7,
            policy_number: 'POL-LIC-1005-A',
            holder_id: 5,
            holder_name: 'Manish Verma',
            claim_type: 'Critical Illness',
            claim_date: '2026-10-22',
            incident_date: '2026-10-12',
            amount: 500000,
            status: 'Submitted',
            description: 'Claim filed for cardiac stent procedure under supplementary critical illness rider.',
            documents: ['CathLab_Report.pdf', 'Medical_Records.pdf', 'Claim_Intimation.pdf'],
            settlement_date: null,
            investigator_notes: 'Initial documents received. Awaiting medical referee report from Noida branch panel doctor.'
        }
    ],

    communications: [
        {
            id: 1,
            holder_id: 2,
            holder_name: 'Priya Patel',
            type: 'SMS',
            subject: 'Renewal Premium Due Notice',
            message: 'Dear Priya Patel, your health policy POL-LIC-1002-A premium of Rs. 14,200 is due on 05-Nov-2026. Pay easily via PolicyPro portal. - LIC DAS Branch',
            sent_date: '2026-10-25 10:30 AM',
            status: 'Delivered'
        },
        {
            id: 2,
            holder_id: 3,
            holder_name: 'Vikramaditya Rao',
            type: 'WhatsApp',
            subject: 'Survival Benefit Verification Update',
            message: 'Namaste Vikramaditya ji, your claim CLM-2026-078 for Rs. 3,75,000 Survival Benefit is in final accounting review. Settlement expected by 05-Nov.',
            sent_date: '2026-10-26 03:15 PM',
            status: 'Delivered'
        },
        {
            id: 3,
            holder_id: 1,
            holder_name: 'Amit Sharma',
            type: 'Email',
            subject: 'Policy Bond E-Kit Delivered: POL-LIC-1001-B',
            message: 'Dear Amit Sharma, Congratulations! Your Tech Term Pure Risk Shield policy bond has been digitally issued. Sum Assured: Rs. 1,00,00,000.',
            sent_date: '2026-10-10 11:00 AM',
            status: 'Delivered'
        },
        {
            id: 4,
            holder_id: 5,
            holder_name: 'Manish Verma',
            type: 'SMS',
            subject: 'Urgent: Policy Lapsed Notice',
            message: 'Alert: Your policy POL-LIC-1005-A has lapsed due to unpaid premium past the grace period. Please contact your LIC agent for revival terms.',
            sent_date: '2026-10-18 09:45 AM',
            status: 'Delivered'
        }
    ]
};

// Storage Handler Functions
class DataManager {
    static init() {
        if (!localStorage.getItem(STORAGE_KEYS.HOLDERS)) {
            this.resetToDefaults();
        }
    }

    static resetToDefaults() {
        localStorage.setItem(STORAGE_KEYS.HOLDERS, JSON.stringify(INITIAL_DATA.policyHolders));
        localStorage.setItem(STORAGE_KEYS.POLICIES, JSON.stringify(INITIAL_DATA.policies));
        localStorage.setItem(STORAGE_KEYS.PREMIUMS, JSON.stringify(INITIAL_DATA.premiums));
        localStorage.setItem(STORAGE_KEYS.RENEWALS, JSON.stringify(INITIAL_DATA.renewals));
        localStorage.setItem(STORAGE_KEYS.CLAIMS, JSON.stringify(INITIAL_DATA.claims));
        localStorage.setItem(STORAGE_KEYS.COMMS, JSON.stringify(INITIAL_DATA.communications));
        if (!localStorage.getItem(STORAGE_KEYS.USER)) {
            localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(INITIAL_DATA.users[0]));
        }
    }

    static getHolders() {
        return JSON.parse(localStorage.getItem(STORAGE_KEYS.HOLDERS) || '[]');
    }

    static saveHolders(holders) {
        localStorage.setItem(STORAGE_KEYS.HOLDERS, JSON.stringify(holders));
    }

    static getHolderById(id) {
        const holders = this.getHolders();
        return holders.find(h => h.id === parseInt(id));
    }

    static addHolder(holderData) {
        const holders = this.getHolders();
        const nextId = holders.length > 0 ? Math.max(...holders.map(h => h.id)) + 1 : 1;
        const newHolder = {
            id: nextId,
            holderCode: `PH-${1000 + nextId}`,
            status: 'Active',
            registered_date: new Date().toISOString().split('T')[0],
            ...holderData
        };
        holders.unshift(newHolder);
        this.saveHolders(holders);
        return newHolder;
    }

    static updateHolder(id, updatedFields) {
        const holders = this.getHolders();
        const index = holders.findIndex(h => h.id === parseInt(id));
        if (index !== -1) {
            holders[index] = { ...holders[index], ...updatedFields };
            this.saveHolders(holders);
            return holders[index];
        }
        return null;
    }

    static deleteHolder(id) {
        let holders = this.getHolders();
        holders = holders.filter(h => h.id !== parseInt(id));
        this.saveHolders(holders);
    }

    // Policies
    static getPolicies() {
        return JSON.parse(localStorage.getItem(STORAGE_KEYS.POLICIES) || '[]');
    }

    static savePolicies(policies) {
        localStorage.setItem(STORAGE_KEYS.POLICIES, JSON.stringify(policies));
    }

    static getPoliciesByHolderId(holderId) {
        const policies = this.getPolicies();
        return policies.filter(p => p.holder_id === parseInt(holderId));
    }

    static addPolicy(policyData) {
        const policies = this.getPolicies();
        const nextId = policies.length > 0 ? Math.max(...policies.map(p => p.id)) + 1 : 1;
        const holder = this.getHolderById(policyData.holder_id);

        const newPolicy = {
            id: nextId,
            policy_number: `POL-LIC-${Math.floor(100000 + Math.random() * 900000)}`,
            holder_name: holder ? holder.name : 'Unknown',
            status: 'Active',
            start_date: policyData.start_date || new Date().toISOString().split('T')[0],
            ...policyData
        };

        // Calculate maturity end_date if not set
        if (!newPolicy.end_date && newPolicy.term) {
            const start = new Date(newPolicy.start_date);
            start.setFullYear(start.getFullYear() + parseInt(newPolicy.term));
            newPolicy.end_date = start.toISOString().split('T')[0];
        }

        // Set next due date
        if (!newPolicy.next_due_date) {
            const due = new Date(newPolicy.start_date);
            if (newPolicy.payment_frequency === 'Monthly') due.setMonth(due.getMonth() + 1);
            else if (newPolicy.payment_frequency === 'Quarterly') due.setMonth(due.getMonth() + 3);
            else if (newPolicy.payment_frequency === 'Half-Yearly') due.setMonth(due.getMonth() + 6);
            else if (newPolicy.payment_frequency === 'Single Premium') due.setFullYear(due.getFullYear() + parseInt(newPolicy.term));
            else due.setFullYear(due.getFullYear() + 1); // Yearly default
            newPolicy.next_due_date = due.toISOString().split('T')[0];
        }

        policies.unshift(newPolicy);
        this.savePolicies(policies);

        // Also add an upcoming renewal item
        this.syncRenewalForPolicy(newPolicy);

        // Add auto communication
        this.addCommunication({
            holder_id: newPolicy.holder_id,
            holder_name: newPolicy.holder_name,
            type: 'Email',
            subject: `Policy Issued: ${newPolicy.plan_name} (${newPolicy.policy_number})`,
            message: `Dear ${newPolicy.holder_name}, congratulations! Your policy ${newPolicy.policy_number} has been issued with Sum Assured ₹${newPolicy.sum_assured.toLocaleString('en-IN')}. First premium: ₹${newPolicy.premium_amount.toLocaleString('en-IN')}.`
        });

        return newPolicy;
    }

    // Premiums
    static getPremiums() {
        return JSON.parse(localStorage.getItem(STORAGE_KEYS.PREMIUMS) || '[]');
    }

    static savePremiums(premiums) {
        localStorage.setItem(STORAGE_KEYS.PREMIUMS, JSON.stringify(premiums));
    }

    static recordPayment(paymentData) {
        const premiums = this.getPremiums();
        const nextId = premiums.length > 0 ? Math.max(...premiums.map(p => p.id)) + 1 : 1;
        const receiptNo = `RCP-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

        const newPayment = {
            id: nextId,
            receipt_no: receiptNo,
            payment_date: paymentData.payment_date || new Date().toISOString().split('T')[0],
            status: 'Completed',
            ...paymentData
        };

        premiums.unshift(newPayment);
        this.savePremiums(premiums);

        // Update the policy's next due date and status
        const policies = this.getPolicies();
        const policyIndex = policies.findIndex(p => p.id === parseInt(paymentData.policy_id));
        if (policyIndex !== -1) {
            const pol = policies[policyIndex];
            pol.status = 'Active';
            const curDue = new Date(pol.next_due_date || pol.start_date);
            if (pol.payment_frequency === 'Monthly') curDue.setMonth(curDue.getMonth() + 1);
            else if (pol.payment_frequency === 'Quarterly') curDue.setMonth(curDue.getMonth() + 3);
            else if (pol.payment_frequency === 'Half-Yearly') curDue.setMonth(curDue.getMonth() + 6);
            else curDue.setFullYear(curDue.getFullYear() + 1);
            pol.next_due_date = curDue.toISOString().split('T')[0];
            policies[policyIndex] = pol;
            this.savePolicies(policies);

            // Update renewals schedule
            this.syncRenewalForPolicy(pol);
        }

        // Add auto receipt notification
        this.addCommunication({
            holder_id: paymentData.holder_id,
            holder_name: paymentData.holder_name,
            type: 'SMS',
            subject: `Premium Received Receipt #${receiptNo}`,
            message: `Received ₹${paymentData.amount.toLocaleString('en-IN')} for Policy ${paymentData.policy_number}. Receipt: ${receiptNo}. Thank you for choosing PolicyPro.`
        });

        return newPayment;
    }

    // Renewals
    static getRenewals() {
        return JSON.parse(localStorage.getItem(STORAGE_KEYS.RENEWALS) || '[]');
    }

    static saveRenewals(renewals) {
        localStorage.setItem(STORAGE_KEYS.RENEWALS, JSON.stringify(renewals));
    }

    static syncRenewalForPolicy(policy) {
        const renewals = this.getRenewals();
        const existingIdx = renewals.findIndex(r => r.policy_id === policy.id);
        const holder = this.getHolderById(policy.holder_id);

        const graceDate = new Date(policy.next_due_date);
        graceDate.setDate(graceDate.getDate() + 30);

        const renewalItem = {
            id: existingIdx !== -1 ? renewals[existingIdx].id : (renewals.length > 0 ? Math.max(...renewals.map(r => r.id)) + 1 : 1),
            policy_id: policy.id,
            policy_number: policy.policy_number,
            holder_id: policy.holder_id,
            holder_name: policy.holder_name,
            holder_phone: holder ? holder.phone : '+91 98000 00000',
            holder_email: holder ? holder.email : 'user@example.com',
            renewal_date: policy.next_due_date,
            grace_period_end: graceDate.toISOString().split('T')[0],
            premium_due: policy.premium_amount,
            status: new Date(policy.next_due_date) < new Date() ? 'Overdue' : 'Upcoming',
            reminder_sent: existingIdx !== -1 ? renewals[existingIdx].reminder_sent : false,
            reminder_count: existingIdx !== -1 ? renewals[existingIdx].reminder_count : 0,
            last_reminder_date: existingIdx !== -1 ? renewals[existingIdx].last_reminder_date : null
        };

        if (existingIdx !== -1) {
            renewals[existingIdx] = renewalItem;
        } else {
            renewals.unshift(renewalItem);
        }
        this.saveRenewals(renewals);
    }

    static sendRenewalReminder(renewalId, channel = 'SMS') {
        const renewals = this.getRenewals();
        const index = renewals.findIndex(r => r.id === parseInt(renewalId));
        if (index !== -1) {
            const ren = renewals[index];
            ren.reminder_sent = true;
            ren.reminder_count = (ren.reminder_count || 0) + 1;
            ren.last_reminder_date = new Date().toISOString().split('T')[0];
            renewals[index] = ren;
            this.saveRenewals(renewals);

            this.addCommunication({
                holder_id: ren.holder_id,
                holder_name: ren.holder_name,
                type: channel,
                subject: `Premium Reminder: Policy ${ren.policy_number}`,
                message: `Dear ${ren.holder_name}, your premium of ₹${ren.premium_due.toLocaleString('en-IN')} for policy ${ren.policy_number} is due on ${ren.renewal_date}. Please pay promptly to enjoy uninterrupted life cover.`
            });

            return ren;
        }
        return null;
    }

    // Claims
    static getClaims() {
        return JSON.parse(localStorage.getItem(STORAGE_KEYS.CLAIMS) || '[]');
    }

    static saveClaims(claims) {
        localStorage.setItem(STORAGE_KEYS.CLAIMS, JSON.stringify(claims));
    }

    static addClaim(claimData) {
        const claims = this.getClaims();
        const nextId = claims.length > 0 ? Math.max(...claims.map(c => c.id)) + 1 : 1;
        const claimNo = `CLM-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;

        const newClaim = {
            id: nextId,
            claim_number: claimNo,
            claim_date: new Date().toISOString().split('T')[0],
            status: 'Submitted',
            settlement_date: null,
            investigator_notes: 'Claim initiated. Assigned to claims assessment desk for documentation review.',
            ...claimData
        };

        claims.unshift(newClaim);
        this.saveClaims(claims);

        this.addCommunication({
            holder_id: newClaim.holder_id,
            holder_name: newClaim.holder_name,
            type: 'Email',
            subject: `Claim Registered: ${claimNo}`,
            message: `Your claim ${claimNo} under policy ${newClaim.policy_number} for ₹${newClaim.amount.toLocaleString('en-IN')} has been submitted. Our claims executive will reach out shortly.`
        });

        return newClaim;
    }

    static updateClaimStatus(claimId, newStatus, notes = '') {
        const claims = this.getClaims();
        const index = claims.findIndex(c => c.id === parseInt(claimId));
        if (index !== -1) {
            claims[index].status = newStatus;
            if (notes) claims[index].investigator_notes = notes;
            if (newStatus === 'Approved' || newStatus === 'Settled') {
                claims[index].settlement_date = new Date().toISOString().split('T')[0];
            }
            this.saveClaims(claims);

            this.addCommunication({
                holder_id: claims[index].holder_id,
                holder_name: claims[index].holder_name,
                type: 'SMS',
                subject: `Claim Status Update: ${claims[index].claim_number}`,
                message: `Update on Claim ${claims[index].claim_number}: Current status is "${newStatus}". Note: ${notes || 'Action recorded in system.'}`
            });

            return claims[index];
        }
        return null;
    }

    // Communications
    static getCommunications() {
        return JSON.parse(localStorage.getItem(STORAGE_KEYS.COMMS) || '[]');
    }

    static saveCommunications(comms) {
        localStorage.setItem(STORAGE_KEYS.COMMS, JSON.stringify(comms));
    }

    static addCommunication(commData) {
        const comms = this.getCommunications();
        const nextId = comms.length > 0 ? Math.max(...comms.map(c => c.id)) + 1 : 1;
        const now = new Date();
        const dateStr = `${now.toISOString().split('T')[0]} ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

        const newComm = {
            id: nextId,
            sent_date: dateStr,
            status: 'Delivered',
            ...commData
        };

        comms.unshift(newComm);
        this.saveCommunications(comms);
        return newComm;
    }

    // Current User & Role Management
    static getCurrentUser() {
        const userStr = localStorage.getItem(STORAGE_KEYS.USER);
        if (userStr) return JSON.parse(userStr);
        return INITIAL_DATA.users[0];
    }

    static setCurrentUser(user) {
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    }

    static getUsers() {
        return INITIAL_DATA.users;
    }

    // Theme Management
    static getTheme() {
        return localStorage.getItem(STORAGE_KEYS.THEME) || 'light';
    }

    static setTheme(theme) {
        localStorage.setItem(STORAGE_KEYS.THEME, theme);
    }
}

// Initialize immediately
DataManager.init();


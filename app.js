/**
 * PolicyPro - Complete Insurance Policy Holder Management Platform
 * Task ID: WD-LIC-002 | Student Code: DAS-LIC-002
 * Data Alcott Systems - Free Web Development Internship
 * 
 * Core Application Logic & Interactivity
 */

const App = {
    currentHolderDetailId: null,
    charts: {},

    init() {
        // Apply saved theme
        this.initTheme();

        // Setup Hash Navigation & Event Listeners
        this.initNavigation();
        this.initUIEventListeners();

        // Populate initial dropdowns and forms
        this.populateDropdowns();

        // Initial Route Handling
        const hash = window.location.hash.replace('#', '') || 'dashboard';
        this.navigateTo(hash);

        // Update Topbar User & Alerts
        this.updateUserDisplay();
        this.updateNotifications();
        this.updateBadgeCounters();
    },

    // =========================================================================
    // THEME & USER MANAGEMENT
    // =========================================================================
    initTheme() {
        const theme = DataManager.getTheme();
        document.documentElement.setAttribute('data-theme', theme);
        const icon = document.querySelector('#themeToggleBtn i');
        if (icon) {
            icon.className = theme === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
        }
    },

    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        DataManager.setTheme(newTheme);

        const icon = document.querySelector('#themeToggleBtn i');
        if (icon) {
            icon.className = newTheme === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
        }

        // Re-render charts for theme compatibility
        this.renderDashboardCharts();
        this.renderReportCharts();
        this.renderPaymentMethodChart();
        this.showToast(`Switched to ${newTheme} mode`, 'info');
    },

    updateUserDisplay() {
        const user = DataManager.getCurrentUser();
        if (!user) return;
        const initials = user.name.split(' ').map(n => n[0]).join('').substring(0, 2);
        const avatarEl = document.getElementById('topUserAvatar');
        const nameEl = document.getElementById('topUserName');
        const roleEl = document.getElementById('topUserRole');

        if (avatarEl) avatarEl.textContent = initials;
        if (nameEl) nameEl.textContent = user.name;
        if (roleEl) roleEl.textContent = `${user.role} (${user.branch})`;
    },

    switchUser(userId) {
        const users = DataManager.getUsers();
        const selected = users.find(u => u.id === userId);
        if (selected) {
            DataManager.setCurrentUser(selected);
            this.updateUserDisplay();
            document.querySelectorAll('#userDropdownPanel .dropdown-item').forEach(el => {
                el.classList.toggle('active', el.dataset.userId === userId);
            });
            document.getElementById('userDropdownPanel').classList.remove('show');
            this.showToast(`Active User switched to: ${selected.name} (${selected.role})`, 'success');
        }
    },

    updateNotifications() {
        const renewals = DataManager.getRenewals().filter(r => r.status === 'Due' || r.status === 'Overdue');
        const claims = DataManager.getClaims().filter(c => c.status === 'Submitted');
        const totalAlerts = renewals.length + claims.length;

        const badge = document.getElementById('notifBadge');
        if (badge) badge.textContent = totalAlerts;

        const notifList = document.getElementById('notifList');
        if (!notifList) return;

        let html = '';
        renewals.forEach(r => {
            html += `
                <div class="notif-item" onclick="App.navigateTo('renewals'); document.getElementById('notificationsPanel').classList.remove('show');">
                    <div class="notif-icon ${r.status === 'Overdue' ? 'danger' : 'warn'}">
                        <i class="fa-solid fa-bell"></i>
                    </div>
                    <div class="notif-content">
                        <h5>Renewal ${r.status}: ${r.holder_name}</h5>
                        <p>${r.policy_number} · Premium ₹${r.premium_due.toLocaleString('en-IN')}</p>
                    </div>
                </div>
            `;
        });

        claims.forEach(c => {
            html += `
                <div class="notif-item" onclick="App.navigateTo('claims'); document.getElementById('notificationsPanel').classList.remove('show');">
                    <div class="notif-icon info">
                        <i class="fa-solid fa-hand-holding-medical"></i>
                    </div>
                    <div class="notif-content">
                        <h5>New Claim Filed: ${c.claim_number}</h5>
                        <p>${c.holder_name} · ₹${c.amount.toLocaleString('en-IN')}</p>
                    </div>
                </div>
            `;
        });

        if (totalAlerts === 0) {
            html = '<div style="padding:1.5rem; text-align:center; color:var(--text-muted); font-size:0.85rem;">No pending alerts. All systems healthy!</div>';
        }
        notifList.innerHTML = html;
    },

    updateBadgeCounters() {
        const holders = DataManager.getHolders();
        const renewalsDue = DataManager.getRenewals().filter(r => r.status === 'Due' || r.status === 'Overdue');
        const claims = DataManager.getClaims().filter(c => c.status !== 'Settled' && c.status !== 'Rejected');

        const holdersBadge = document.getElementById('holdersCountBadge');
        if (holdersBadge) holdersBadge.textContent = holders.length;

        const renewalBadge = document.getElementById('renewalAlertBadge');
        if (renewalBadge) renewalBadge.textContent = renewalsDue.length;

        const claimsBadge = document.getElementById('claimsPendingBadge');
        if (claimsBadge) claimsBadge.textContent = claims.length;
    },

    // =========================================================================
    // NAVIGATION & ROUTING
    // =========================================================================
    initNavigation() {
        window.addEventListener('hashchange', () => {
            const hash = window.location.hash.replace('#', '') || 'dashboard';
            this.navigateTo(hash, false);
        });

        document.querySelectorAll('.sidebar-nav .nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                const target = link.dataset.target;
                if (target) {
                    this.navigateTo(target);
                }
            });
        });
    },

    navigateTo(sectionId, updateHash = true) {
        if (updateHash) {
            window.location.hash = sectionId;
        }

        // Close mobile sidebar if open
        const sidebar = document.getElementById('sidebar');
        if (sidebar) sidebar.classList.remove('open');

        // Update active class on nav links
        document.querySelectorAll('.sidebar-nav .nav-link').forEach(link => {
            link.classList.toggle('active', link.dataset.target === sectionId);
        });

        // Show corresponding section
        document.querySelectorAll('.content-section').forEach(sec => {
            sec.classList.remove('active');
        });

        const activeSec = document.getElementById(sectionId);
        if (activeSec) {
            activeSec.classList.add('active');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }

        // Trigger module renderer based on section
        switch (sectionId) {
            case 'dashboard':
                this.renderDashboard();
                break;
            case 'holders':
                this.renderHoldersList();
                break;
            case 'holder-detail':
                if (this.currentHolderDetailId) {
                    this.renderHolderDetail(this.currentHolderDetailId);
                } else {
                    this.navigateTo('holders');
                }
                break;
            case 'premiums':
                this.renderPremiumsSection();
                break;
            case 'renewals':
                this.renderRenewalsSection();
                break;
            case 'claims':
                this.renderClaimsSection();
                break;
            case 'communications':
                this.renderCommunicationsSection();
                break;
            case 'reports':
                this.renderReportsSection();
                break;
            case 'register':
                this.setupRegistrationDefaults();
                break;
            case 'issue-policy':
                this.setupPolicyIssuanceDefaults();
                break;
        }

        this.updateBadgeCounters();
    },

    // =========================================================================
    // UI EVENT LISTENERS
    // =========================================================================
    initUIEventListeners() {
        // Sidebar Toggle
        const toggleBtn = document.getElementById('sidebarToggleBtn');
        const closeBtn = document.getElementById('sidebarCloseBtn');
        const sidebar = document.getElementById('sidebar');
        if (toggleBtn && sidebar) {
            toggleBtn.addEventListener('click', () => sidebar.classList.toggle('open'));
        }
        if (closeBtn && sidebar) {
            closeBtn.addEventListener('click', () => sidebar.classList.remove('open'));
        }

        // Theme Toggle
        const themeBtn = document.getElementById('themeToggleBtn');
        if (themeBtn) {
            themeBtn.addEventListener('click', () => this.toggleTheme());
        }

        // Reset Data Button
        const resetBtn = document.getElementById('resetDataBtn');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                if (confirm('Reset all data back to original internship demo seed data? Any new entries will be restored to defaults.')) {
                    DataManager.resetToDefaults();
                    this.populateDropdowns();
                    this.renderDashboard();
                    this.updateNotifications();
                    this.updateBadgeCounters();
                    this.showToast('Internship sample data successfully reset!', 'success');
                }
            });
        }

        // Notifications Bell
        const notifBtn = document.getElementById('notifBellBtn');
        const notifPanel = document.getElementById('notificationsPanel');
        if (notifBtn && notifPanel) {
            notifBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                notifPanel.classList.toggle('show');
                const userPanel = document.getElementById('userDropdownPanel');
                if (userPanel) userPanel.classList.remove('show');
            });
        }

        // User Profile Dropdown
        const userBtn = document.getElementById('userProfileBtn');
        const userPanel = document.getElementById('userDropdownPanel');
        if (userBtn && userPanel) {
            userBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                userPanel.classList.toggle('show');
                if (notifPanel) notifPanel.classList.remove('show');
            });

            userPanel.querySelectorAll('.dropdown-item').forEach(item => {
                item.addEventListener('click', () => {
                    this.switchUser(item.dataset.userId);
                });
            });
        }

        // Close dropdowns on outside click
        document.addEventListener('click', () => {
            if (notifPanel) notifPanel.classList.remove('show');
            if (userPanel) userPanel.classList.remove('show');
        });

        // Global Search
        const searchInput = document.getElementById('globalSearchInput');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                const term = e.target.value.trim().toLowerCase();
                if (term.length > 1) {
                    this.navigateTo('holders');
                    const holderSearch = document.getElementById('holderSearchInput');
                    if (holderSearch) {
                        holderSearch.value = term;
                        this.renderHoldersList();
                    }
                }
            });
        }

        // Forms Setup
        this.setupForms();
    },

    setupForms() {
        // 1. Holder Registration Form
        const regForm = document.getElementById('holderRegistrationForm');
        if (regForm) {
            regForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const newHolder = {
                    name: document.getElementById('regFullName').value.trim(),
                    email: document.getElementById('regEmail').value.trim(),
                    phone: document.getElementById('regPhone').value.trim(),
                    dob: document.getElementById('regDob').value,
                    gender: document.getElementById('regGender').value,
                    pan: document.getElementById('regPan').value.trim().toUpperCase(),
                    address: document.getElementById('regAddress').value.trim(),
                    city: document.getElementById('regCity').value.trim(),
                    state: document.getElementById('regState').value.trim(),
                    pincode: document.getElementById('regPincode').value.trim(),
                    occupation: document.getElementById('regOccupation').value.trim(),
                    income: parseFloat(document.getElementById('regIncome').value) || 0,
                    nominee: document.getElementById('regNominee').value.trim(),
                    nominee_relation: document.getElementById('regNomineeRelation').value,
                    nominee_phone: document.getElementById('regNomineePhone').value.trim()
                };

                const savedHolder = DataManager.addHolder(newHolder);
                regForm.reset();
                this.populateDropdowns();
                this.updateBadgeCounters();
                this.showToast(`Policy Holder ${savedHolder.name} registered (${savedHolder.holderCode})!`, 'success');

                if (confirm(`Policy Holder ${savedHolder.name} registered successfully!\n\nWould you like to issue a new insurance policy for this client now?`)) {
                    this.setupPolicyIssuanceDefaults(savedHolder.id);
                    this.navigateTo('issue-policy');
                } else {
                    this.navigateTo('holders');
                }
            });
        }

        // 2. Policy Issuance Form
        const policyForm = document.getElementById('policyIssuanceForm');
        if (policyForm) {
            // Auto calculate premium button
            const autoCalcBtn = document.getElementById('autoCalcPremiumBtn');
            if (autoCalcBtn) {
                autoCalcBtn.addEventListener('click', () => this.calculateSuggestedPremium());
            }

            const sumInput = document.getElementById('issueSumAssured');
            const freqInput = document.getElementById('issuePaymentFreq');
            if (sumInput) sumInput.addEventListener('input', () => this.calculateSuggestedPremium());
            if (freqInput) freqInput.addEventListener('change', () => this.calculateSuggestedPremium());

            policyForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const holderId = parseInt(document.getElementById('issueHolderSelect').value);
                const policyType = document.getElementById('issuePolicyType').value;
                const planName = document.getElementById('issuePlanName').value.trim();
                const sumAssured = parseFloat(document.getElementById('issueSumAssured').value) || 500000;
                const paymentFrequency = document.getElementById('issuePaymentFreq').value;
                const term = parseInt(document.getElementById('issueTerm').value) || 20;
                const premiumTerm = parseInt(document.getElementById('issuePremiumTerm').value) || 15;
                const premiumAmount = parseFloat(document.getElementById('issuePremiumAmount').value) || 25000;
                const startDate = document.getElementById('issueStartDate').value || new Date().toISOString().split('T')[0];

                const newPolicy = DataManager.addPolicy({
                    holder_id: holderId,
                    policy_type: policyType,
                    plan_name: planName,
                    sum_assured: sumAssured,
                    payment_frequency: paymentFrequency,
                    term: term,
                    premium_term: premiumTerm,
                    premium_amount: premiumAmount,
                    start_date: startDate
                });

                this.populateDropdowns();
                this.updateBadgeCounters();
                this.showToast(`Policy ${newPolicy.policy_number} issued for ${newPolicy.holder_name}!`, 'success');
                this.openPolicyBondModal(newPolicy.id);
            });
        }

        // 3. Premium Collection Form
        const premForm = document.getElementById('premiumCollectionForm');
        const premPolicySelect = document.getElementById('premPolicySelect');
        if (premPolicySelect) {
            premPolicySelect.addEventListener('change', (e) => {
                const policyId = parseInt(e.target.value);
                this.previewPolicyForPremium(policyId);
            });
        }

        if (premForm) {
            premForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const policyId = parseInt(document.getElementById('premPolicySelect').value);
                const policy = DataManager.getPolicies().find(p => p.id === policyId);
                if (!policy) {
                    this.showToast('Please select a valid policy', 'danger');
                    return;
                }

                const amount = parseFloat(document.getElementById('premAmount').value) || policy.premium_amount;
                const method = document.getElementById('premMethod').value;
                const date = document.getElementById('premDate').value;
                const txnId = document.getElementById('premTxnId').value.trim() || `TXN-${Math.floor(1000000 + Math.random() * 9000000)}`;
                const notes = document.getElementById('premNotes').value.trim() || 'Premium instalment reconciled.';

                const receipt = DataManager.recordPayment({
                    policy_id: policy.id,
                    policy_number: policy.policy_number,
                    holder_id: policy.holder_id,
                    holder_name: policy.holder_name,
                    amount: amount,
                    payment_method: method,
                    payment_date: date,
                    transaction_id: txnId,
                    notes: notes
                });

                this.showToast(`Premium of ₹${amount.toLocaleString('en-IN')} received! Receipt #${receipt.receipt_no}`, 'success');
                this.openReceiptModal(receipt.id);
                this.renderPremiumsSection();
            });
        }

        // 4. New Claim Form (Modal)
        const newClaimForm = document.getElementById('newClaimForm');
        if (newClaimForm) {
            newClaimForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const policyId = parseInt(document.getElementById('claimPolicySelect').value);
                const policy = DataManager.getPolicies().find(p => p.id === policyId);
                if (!policy) return;

                const claimType = document.getElementById('claimType').value;
                const amount = parseFloat(document.getElementById('claimAmount').value) || 50000;
                const incidentDate = document.getElementById('claimIncidentDate').value;
                const docsInput = document.getElementById('claimDocs').value.trim();
                const docs = docsInput ? docsInput.split(',').map(d => d.trim()) : ['Hospital_Bill.pdf', 'Discharge_Record.pdf'];
                const description = document.getElementById('claimDescription').value.trim();

                const newClaim = DataManager.addClaim({
                    policy_id: policy.id,
                    policy_number: policy.policy_number,
                    holder_id: policy.holder_id,
                    holder_name: policy.holder_name,
                    claim_type: claimType,
                    amount: amount,
                    incident_date: incidentDate,
                    documents: docs,
                    description: description
                });

                newClaimForm.reset();
                this.closeModal('newClaimModal');
                this.showToast(`Claim ${newClaim.claim_number} filed for ₹${amount.toLocaleString('en-IN')}`, 'success');
                this.renderClaimsSection();
                this.updateNotifications();
            });
        }

        // 5. Review Claim Form (Manager Modal)
        const reviewForm = document.getElementById('reviewClaimForm');
        if (reviewForm) {
            reviewForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const claimId = parseInt(document.getElementById('reviewClaimId').value);
                const status = document.getElementById('reviewClaimStatusSelect').value;
                const notes = document.getElementById('reviewClaimNotes').value.trim();

                DataManager.updateClaimStatus(claimId, status, notes);
                this.closeModal('reviewClaimModal');
                this.showToast(`Claim decision updated to: ${status}`, 'success');
                this.renderClaimsSection();
                this.updateNotifications();
            });
        }

        // 6. Communication Composer Form
        const commForm = document.getElementById('commComposerForm');
        const commTemplate = document.getElementById('commTemplate');
        if (commTemplate) {
            commTemplate.addEventListener('change', () => this.applyCommunicationTemplate());
        }

        if (commForm) {
            commForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const holderId = parseInt(document.getElementById('commHolderSelect').value);
                const holder = DataManager.getHolderById(holderId);
                if (!holder) return;

                const channel = document.getElementById('commChannel').value;
                const subject = document.getElementById('commSubject').value.trim();
                const message = document.getElementById('commMessage').value.trim();

                DataManager.addCommunication({
                    holder_id: holder.id,
                    holder_name: holder.name,
                    type: channel,
                    subject: subject,
                    message: message
                });

                commForm.reset();
                this.showToast(`Notification delivered to ${holder.name} via ${channel}!`, 'success');
                this.renderCommunicationsSection();
            });
        }

        // 7. Bulk Renewal Reminder Button
        const broadcastBtn = document.getElementById('broadcastRemindersBtn');
        if (broadcastBtn) {
            broadcastBtn.addEventListener('click', () => {
                const renewals = DataManager.getRenewals().filter(r => r.status === 'Due' || r.status === 'Overdue');
                if (renewals.length === 0) {
                    this.showToast('No renewals currently due for reminders.', 'info');
                    return;
                }
                renewals.forEach(r => DataManager.sendRenewalReminder(r.id, 'SMS'));
                this.showToast(`Dispatched reminders to ${renewals.length} policy holders!`, 'success');
                this.renderRenewalsSection();
            });
        }

        // 8. Holders Search & Filter Listeners
        const holderSearch = document.getElementById('holderSearchInput');
        const holderPlanFilter = document.getElementById('holderPlanFilter');
        const holderStatusFilter = document.getElementById('holderStatusFilter');
        if (holderSearch) holderSearch.addEventListener('input', () => this.renderHoldersList());
        if (holderPlanFilter) holderPlanFilter.addEventListener('change', () => this.renderHoldersList());
        if (holderStatusFilter) holderStatusFilter.addEventListener('change', () => this.renderHoldersList());

        const modeGrid = document.getElementById('viewModeGridBtn');
        const modeTable = document.getElementById('viewModeTableBtn');
        if (modeGrid && modeTable) {
            modeGrid.addEventListener('click', () => {
                modeGrid.classList.add('active');
                modeTable.classList.remove('active');
                document.getElementById('holdersTableView').style.display = 'none';
                document.getElementById('holdersGridView').style.display = 'grid';
            });
            modeTable.addEventListener('click', () => {
                modeTable.classList.add('active');
                modeGrid.classList.remove('active');
                document.getElementById('holdersGridView').style.display = 'none';
                document.getElementById('holdersTableView').style.display = 'block';
            });
        }
    },

    populateDropdowns() {
        const holders = DataManager.getHolders();
        const policies = DataManager.getPolicies();

        // 1. Issue Policy Holder Dropdown
        const issueSelect = document.getElementById('issueHolderSelect');
        if (issueSelect) {
            issueSelect.innerHTML = holders.map(h => `
                <option value="${h.id}">${h.name} (${h.holderCode}) · ${h.city} · PAN: ${h.pan}</option>
            `).join('');
        }

        // 2. Premium Policy Dropdown
        const premSelect = document.getElementById('premPolicySelect');
        if (premSelect) {
            premSelect.innerHTML = policies.map(p => `
                <option value="${p.id}">${p.policy_number} - ${p.holder_name} (${p.plan_name}) [₹${p.premium_amount.toLocaleString('en-IN')}]</option>
            `).join('');
            if (policies.length > 0) {
                this.previewPolicyForPremium(policies[0].id);
            }
        }

        // 3. Claim Policy Dropdown
        const claimSelect = document.getElementById('claimPolicySelect');
        if (claimSelect) {
            claimSelect.innerHTML = policies.map(p => `
                <option value="${p.id}">${p.policy_number} · ${p.holder_name} · ${p.plan_name} (Cover: ₹${p.sum_assured.toLocaleString('en-IN')})</option>
            `).join('');
        }

        // 4. Communication Holder Dropdown
        const commSelect = document.getElementById('commHolderSelect');
        if (commSelect) {
            commSelect.innerHTML = holders.map(h => `
                <option value="${h.id}">${h.name} (${h.email} · ${h.phone})</option>
            `).join('');
        }
    },

    calculateSuggestedPremium() {
        const sumAssured = parseFloat(document.getElementById('issueSumAssured').value) || 500000;
        const freq = document.getElementById('issuePaymentFreq').value;
        const policyType = document.getElementById('issuePolicyType').value;

        // Base rate ~3.5% for endowment, ~0.25% for term, ~2% for health
        let rate = 0.035;
        if (policyType === 'Term Insurance') rate = 0.0025;
        else if (policyType === 'Health Insurance') rate = 0.018;
        else if (policyType === 'Pension Plan') rate = 0.045;

        let annualPrem = sumAssured * rate;
        let finalPrem = annualPrem;

        if (freq === 'Monthly') finalPrem = Math.round(annualPrem / 12 * 1.05);
        else if (freq === 'Quarterly') finalPrem = Math.round(annualPrem / 4 * 1.03);
        else if (freq === 'Half-Yearly') finalPrem = Math.round(annualPrem / 2 * 1.02);
        else if (freq === 'Single Premium') finalPrem = Math.round(sumAssured * 0.45);
        else finalPrem = Math.round(annualPrem);

        const premInput = document.getElementById('issuePremiumAmount');
        if (premInput) premInput.value = finalPrem;
    },

    setupRegistrationDefaults() {
        const today = new Date().toISOString().split('T')[0];
        const dobInput = document.getElementById('regDob');
        if (dobInput && !dobInput.value) {
            dobInput.value = '1992-06-15';
            dobInput.max = today;
        }
    },

    setupPolicyIssuanceDefaults(preselectedHolderId = null) {
        if (preselectedHolderId) {
            const select = document.getElementById('issueHolderSelect');
            if (select) select.value = preselectedHolderId;
        }
        const startDateInput = document.getElementById('issueStartDate');
        if (startDateInput && !startDateInput.value) {
            startDateInput.value = new Date().toISOString().split('T')[0];
        }
        this.calculateSuggestedPremium();
    },

    previewPolicyForPremium(policyId) {
        const policy = DataManager.getPolicies().find(p => p.id === policyId);
        const infoBox = document.getElementById('premPolicyInfoBox');
        if (!policy || !infoBox) return;

        infoBox.style.display = 'block';
        document.getElementById('premHolderNameText').textContent = policy.holder_name;
        document.getElementById('premPlanNameText').textContent = `${policy.plan_name} (${policy.policy_type})`;
        document.getElementById('premDueDateText').textContent = policy.next_due_date || 'Current Cycle';

        const amtInput = document.getElementById('premAmount');
        if (amtInput) amtInput.value = policy.premium_amount;

        const dateInput = document.getElementById('premDate');
        if (dateInput) dateInput.value = new Date().toISOString().split('T')[0];
    },

    applyCommunicationTemplate() {
        const template = document.getElementById('commTemplate').value;
        const holderId = parseInt(document.getElementById('commHolderSelect').value);
        const holder = DataManager.getHolderById(holderId);
        const name = holder ? holder.name : 'Valued Policy Holder';

        const subjectInput = document.getElementById('commSubject');
        const msgInput = document.getElementById('commMessage');

        if (template === 'welcome') {
            subjectInput.value = `Welcome to LIC PolicyPro Family, ${name}!`;
            msgInput.value = `Dear ${name}, thank you for choosing PolicyPro. Your life insurance policy has been successfully underwritten. Please download your policy bond from your portal.`;
        } else if (template === 'renewal') {
            subjectInput.value = `Upcoming Premium Due Reminder - PolicyPro`;
            msgInput.value = `Dear ${name}, this is a gentle reminder that your policy renewal premium is due soon. Pay online instantly using UPI or Net Banking to ensure continuous life protection.`;
        } else if (template === 'overdue') {
            subjectInput.value = `URGENT: Grace Period Notice - Premium Overdue`;
            msgInput.value = `Dear ${name}, your policy premium is currently past due. Please remit payment immediately within the 30-day grace period to prevent policy lapsation.`;
        } else if (template === 'claim') {
            subjectInput.value = `Claim Intimation Acknowledged`;
            msgInput.value = `Dear ${name}, we have received your claim filing. Our claims assessment committee is reviewing the submitted documents. You will receive an update within 48 hours.`;
        }
    },

    // =========================================================================
    // MODULE RENDERERS
    // =========================================================================

    // 1. DASHBOARD
    renderDashboard() {
        const holders = DataManager.getHolders();
        const policies = DataManager.getPolicies();
        const premiums = DataManager.getPremiums();
        const renewals = DataManager.getRenewals().filter(r => r.status === 'Due' || r.status === 'Overdue');

        // Total metrics
        const totalHoldersEl = document.getElementById('statTotalHolders');
        if (totalHoldersEl) totalHoldersEl.textContent = holders.length;

        const activePoliciesEl = document.getElementById('statActivePolicies');
        if (activePoliciesEl) activePoliciesEl.textContent = policies.filter(p => p.status === 'Active').length;

        const totalPremiums = premiums.reduce((sum, p) => sum + p.amount, 0);
        const totalPremiumsEl = document.getElementById('statTotalPremiums');
        if (totalPremiumsEl) totalPremiumsEl.textContent = `₹${totalPremiums.toLocaleString('en-IN')}`;

        const pendingRenewalsEl = document.getElementById('statPendingRenewals');
        if (pendingRenewalsEl) pendingRenewalsEl.textContent = renewals.length;

        // Render Recent Policy Holders Table
        const recentHoldersTable = document.getElementById('dashboardRecentHoldersTable');
        if (recentHoldersTable) {
            recentHoldersTable.innerHTML = holders.slice(0, 5).map(h => {
                const holderPolicies = policies.filter(p => p.holder_id === h.id);
                return `
                    <tr>
                        <td>
                            <strong>${h.name}</strong>
                            <div style="font-size:0.75rem; color:var(--text-muted);">${h.holderCode}</div>
                        </td>
                        <td>${h.phone}</td>
                        <td>${h.city}</td>
                        <td><span class="badge badge-active">${holderPolicies.length} Policies</span></td>
                        <td>
                            <button class="btn btn-outline btn-sm" onclick="App.viewHolderDetail(${h.id})">
                                <i class="fa-solid fa-eye"></i> View
                            </button>
                        </td>
                    </tr>
                `;
            }).join('');
        }

        // Render Dashboard Urgent Renewals Table
        const renewalsTable = document.getElementById('dashboardRenewalsTable');
        if (renewalsTable) {
            const dueRenewals = DataManager.getRenewals().slice(0, 5);
            renewalsTable.innerHTML = dueRenewals.map(r => {
                const badgeClass = r.status === 'Overdue' ? 'badge-lapsed' : (r.status === 'Due' ? 'badge-renewal-due' : 'badge-active');
                return `
                    <tr>
                        <td>
                            <strong>${r.policy_number}</strong>
                            <div style="font-size:0.75rem; color:var(--text-muted);">${r.holder_name}</div>
                        </td>
                        <td>${r.renewal_date}</td>
                        <td>₹${r.premium_due.toLocaleString('en-IN')}</td>
                        <td><span class="badge ${badgeClass}">${r.status}</span></td>
                        <td>
                            <button class="btn btn-primary btn-sm" onclick="App.sendQuickReminder(${r.id})" title="Send Reminder">
                                <i class="fa-solid fa-paper-plane"></i>
                            </button>
                        </td>
                    </tr>
                `;
            }).join('');
        }

        // Render Charts
        this.renderDashboardCharts();
    },

    renderDashboardCharts() {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        const textColor = isDark ? '#CBD5E1' : '#475569';
        const gridColor = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)';

        // 1. Monthly Premium Trend Chart
        const trendCanvas = document.getElementById('premiumTrendChart');
        if (trendCanvas) {
            if (this.charts.premiumTrend) this.charts.premiumTrend.destroy();
            this.charts.premiumTrend = new Chart(trendCanvas, {
                type: 'bar',
                data: {
                    labels: ['Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov (Proj)'],
                    datasets: [{
                        label: 'Premium Collections (₹)',
                        data: [45000, 72000, 58000, 95000, 114000, 85000],
                        backgroundColor: '#7C3AED',
                        borderRadius: 6
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { display: false }
                    },
                    scales: {
                        x: { ticks: { color: textColor }, grid: { display: false } },
                        y: { ticks: { color: textColor }, grid: { color: gridColor } }
                    }
                }
            });
        }

        // 2. Policy Distribution Doughnut
        const typeCanvas = document.getElementById('policyTypeChart');
        if (typeCanvas) {
            const policies = DataManager.getPolicies();
            const counts = {};
            policies.forEach(p => counts[p.policy_type] = (counts[p.policy_type] || 0) + 1);

            if (this.charts.policyType) this.charts.policyType.destroy();
            this.charts.policyType = new Chart(typeCanvas, {
                type: 'doughnut',
                data: {
                    labels: Object.keys(counts),
                    datasets: [{
                        data: Object.values(counts),
                        backgroundColor: ['#7C3AED', '#2563EB', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'],
                        borderWidth: 0
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { position: 'bottom', labels: { color: textColor, boxWidth: 12 } }
                    }
                }
            });
        }
    },

    // 2. POLICY HOLDERS DIRECTORY
    renderHoldersList() {
        let holders = DataManager.getHolders();
        const policies = DataManager.getPolicies();

        const search = (document.getElementById('holderSearchInput')?.value || '').trim().toLowerCase();
        const planFilter = document.getElementById('holderPlanFilter')?.value || 'ALL';
        const statusFilter = document.getElementById('holderStatusFilter')?.value || 'ALL';

        // Apply filters
        if (search) {
            holders = holders.filter(h =>
                h.name.toLowerCase().includes(search) ||
                h.email.toLowerCase().includes(search) ||
                h.phone.includes(search) ||
                h.pan.toLowerCase().includes(search) ||
                h.city.toLowerCase().includes(search) ||
                h.holderCode.toLowerCase().includes(search)
            );
        }

        if (statusFilter !== 'ALL') {
            holders = holders.filter(h => h.status === statusFilter);
        }

        if (planFilter !== 'ALL') {
            holders = holders.filter(h => {
                const holderPolicies = policies.filter(p => p.holder_id === h.id);
                return holderPolicies.some(p => p.policy_type === planFilter);
            });
        }

        // Table Body
        const tableBody = document.getElementById('holdersTableBody');
        if (tableBody) {
            if (holders.length === 0) {
                tableBody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding:2rem; color:var(--text-muted);">No policy holders match the filter criteria.</td></tr>`;
            } else {
                tableBody.innerHTML = holders.map(h => {
                    const holderPolicies = policies.filter(p => p.holder_id === h.id);
                    return `
                        <tr>
                            <td><strong style="color:var(--primary);">${h.holderCode}</strong></td>
                            <td>
                                <div style="display:flex; align-items:center; gap:0.6rem;">
                                    <div class="user-avatar" style="width:30px; height:30px; font-size:0.75rem;">${h.name[0]}</div>
                                    <div>
                                        <strong>${h.name}</strong>
                                        <div style="font-size:0.75rem; color:var(--text-muted);">PAN: ${h.pan} · ${h.gender}</div>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <div>${h.phone}</div>
                                <div style="font-size:0.75rem; color:var(--text-muted);">${h.city}, ${h.state}</div>
                            </td>
                            <td>
                                <div>${h.occupation}</div>
                                <div style="font-size:0.75rem; color:var(--success); font-weight:600;">₹${h.income.toLocaleString('en-IN')}/yr</div>
                            </td>
                            <td>
                                <strong>${h.nominee}</strong>
                                <div style="font-size:0.75rem; color:var(--text-muted);">${h.nominee_relation}</div>
                            </td>
                            <td>
                                <span class="badge badge-active">${holderPolicies.length} Active</span>
                            </td>
                            <td>
                                <div style="display:flex; gap:0.4rem;">
                                    <button class="btn btn-outline btn-sm" onclick="App.viewHolderDetail(${h.id})" title="View Full Profile">
                                        <i class="fa-solid fa-eye"></i>
                                    </button>
                                    <button class="btn btn-primary btn-sm" onclick="App.quickIssueForHolder(${h.id})" title="Issue Policy">
                                        <i class="fa-solid fa-file-circle-plus"></i>
                                    </button>
                                    <button class="btn btn-outline btn-sm" onclick="App.deleteHolderPrompt(${h.id})" title="Delete" style="color:var(--danger);">
                                        <i class="fa-solid fa-trash-can"></i>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    `;
                }).join('');
            }
        }

        // Grid Cards
        const gridView = document.getElementById('holdersGridView');
        if (gridView) {
            gridView.innerHTML = holders.map(h => {
                const holderPolicies = policies.filter(p => p.holder_id === h.id);
                return `
                    <div class="holder-card">
                        <div class="holder-card-header">
                            <div class="holder-avatar">${h.name[0]}</div>
                            <div class="holder-card-title">
                                <h4>${h.name}</h4>
                                <span>${h.holderCode} · ${h.city}</span>
                            </div>
                        </div>
                        <div class="holder-meta-grid">
                            <div class="holder-meta-item"><span>Phone</span><strong>${h.phone}</strong></div>
                            <div class="holder-meta-item"><span>Email</span><strong style="word-break:break-all;">${h.email}</strong></div>
                            <div class="holder-meta-item"><span>Occupation</span><strong>${h.occupation}</strong></div>
                            <div class="holder-meta-item"><span>Nominee</span><strong>${h.nominee} (${h.nominee_relation})</strong></div>
                        </div>
                        <div class="holder-card-footer">
                            <span class="badge badge-active">${holderPolicies.length} Policies</span>
                            <div style="display:flex; gap:0.5rem;">
                                <button class="btn btn-outline btn-sm" onclick="App.viewHolderDetail(${h.id})">View Profile</button>
                                <button class="btn btn-primary btn-sm" onclick="App.quickIssueForHolder(${h.id})">Issue Policy</button>
                            </div>
                        </div>
                    </div>
                `;
            }).join('');
        }
    },

    viewHolderDetail(holderId) {
        this.currentHolderDetailId = holderId;
        this.navigateTo('holder-detail');
    },

    quickIssueForHolder(holderId) {
        this.setupPolicyIssuanceDefaults(holderId);
        this.navigateTo('issue-policy');
    },

    deleteHolderPrompt(holderId) {
        const holder = DataManager.getHolderById(holderId);
        if (!holder) return;
        if (confirm(`Are you sure you want to delete policy holder "${holder.name}" (${holder.holderCode})?`)) {
            DataManager.deleteHolder(holderId);
            this.showToast(`Policy Holder ${holder.name} deleted.`, 'info');
            this.populateDropdowns();
            this.renderHoldersList();
            this.updateBadgeCounters();
        }
    },

    // 3. HOLDER DETAIL DOSSIER
    renderHolderDetail(holderId) {
        const holder = DataManager.getHolderById(holderId);
        if (!holder) {
            this.navigateTo('holders');
            return;
        }

        const policies = DataManager.getPoliciesByHolderId(holder.id);
        const premiums = DataManager.getPremiums().filter(p => p.holder_id === holder.id);
        const claims = DataManager.getClaims().filter(c => c.holder_id === holder.id);
        const comms = DataManager.getCommunications().filter(c => c.holder_id === holder.id);

        const container = document.getElementById('holderDetailContainer');
        if (!container) return;

        // Wire top detail button
        const issueBtn = document.getElementById('detailIssuePolicyBtn');
        if (issueBtn) {
            issueBtn.onclick = () => this.quickIssueForHolder(holder.id);
        }

        container.innerHTML = `
            <!-- Profile Hero Card -->
            <div class="card" style="margin-bottom: 1.5rem;">
                <div class="card-body" style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:1.5rem;">
                    <div style="display:flex; align-items:center; gap:1.25rem;">
                        <div class="holder-avatar" style="width:72px; height:72px; font-size:1.8rem;">${holder.name[0]}</div>
                        <div>
                            <div style="display:flex; align-items:center; gap:0.5rem; margin-bottom:0.25rem;">
                                <h2 style="font-family:var(--font-heading); font-size:1.5rem; font-weight:700;">${holder.name}</h2>
                                <span class="badge badge-active"><i class="fa-solid fa-circle-check"></i> KYC Verified</span>
                            </div>
                            <div style="display:flex; gap:1rem; flex-wrap:wrap; font-size:0.85rem; color:var(--text-secondary);">
                                <span><i class="fa-solid fa-id-badge" style="color:var(--primary);"></i> ${holder.holderCode}</span>
                                <span><i class="fa-solid fa-envelope" style="color:var(--primary);"></i> ${holder.email}</span>
                                <span><i class="fa-solid fa-phone" style="color:var(--primary);"></i> ${holder.phone}</span>
                                <span><i class="fa-solid fa-location-dot" style="color:var(--primary);"></i> ${holder.city}, ${holder.state}</span>
                            </div>
                        </div>
                    </div>
                    <div style="display:flex; gap:0.75rem;">
                        <button class="btn btn-outline" onclick="App.composeMessageForHolder(${holder.id})">
                            <i class="fa-solid fa-message"></i> Send Notification
                        </button>
                    </div>
                </div>
            </div>

            <!-- KYC & Nominee Details Grid -->
            <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap:1.25rem; margin-bottom:1.5rem;">
                <div class="card">
                    <div class="card-header">
                        <div class="card-title-group">
                            <h3>Personal & Financial Profile</h3>
                        </div>
                    </div>
                    <div class="card-body" style="font-size:0.88rem;">
                        <div class="cert-row"><span>Date of Birth:</span><strong>${holder.dob} (${holder.gender})</strong></div>
                        <div class="cert-row"><span>PAN Number:</span><strong>${holder.pan}</strong></div>
                        <div class="cert-row"><span>Occupation:</span><strong>${holder.occupation}</strong></div>
                        <div class="cert-row"><span>Annual Income:</span><strong>₹${holder.income.toLocaleString('en-IN')}</strong></div>
                        <div class="cert-row" style="border-bottom:none;"><span>Address:</span><strong style="text-align:right;">${holder.address}, ${holder.pincode}</strong></div>
                    </div>
                </div>

                <div class="card">
                    <div class="card-header">
                        <div class="card-title-group">
                            <h3>Nominee Details</h3>
                        </div>
                    </div>
                    <div class="card-body" style="font-size:0.88rem;">
                        <div class="cert-row"><span>Nominee Name:</span><strong>${holder.nominee}</strong></div>
                        <div class="cert-row"><span>Relationship:</span><strong>${holder.nominee_relation}</strong></div>
                        <div class="cert-row"><span>Nominee Contact:</span><strong>${holder.nominee_phone || 'Same as primary'}</strong></div>
                        <div class="cert-row"><span>Enrollment Date:</span><strong>${holder.registered_date}</strong></div>
                        <div class="cert-row" style="border-bottom:none;"><span>Status:</span><span class="badge badge-active">Active Client</span></div>
                    </div>
                </div>
            </div>

            <!-- Linked Insurance Policies -->
            <div class="card" style="margin-bottom:1.5rem;">
                <div class="card-header">
                    <div class="card-title-group">
                        <h3>Linked Insurance Policies (${policies.length})</h3>
                        <p>Underwritten life & health insurance contracts</p>
                    </div>
                </div>
                <div class="table-responsive">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>Policy Number</th>
                                <th>Plan Details</th>
                                <th>Sum Assured</th>
                                <th>Premium Amount</th>
                                <th>Frequency</th>
                                <th>Next Due Date</th>
                                <th>Status</th>
                                <th>Bond & Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${policies.length === 0 ? '<tr><td colspan="8" style="text-align:center; padding:1.5rem;">No policies issued yet.</td></tr>' :
                            policies.map(p => `
                                <tr>
                                    <td><strong style="color:var(--primary);">${p.policy_number}</strong></td>
                                    <td>
                                        <strong>${p.plan_name}</strong>
                                        <div style="font-size:0.75rem; color:var(--text-muted);">${p.policy_type} · Term: ${p.term} yrs</div>
                                    </td>
                                    <td><strong>₹${p.sum_assured.toLocaleString('en-IN')}</strong></td>
                                    <td>₹${p.premium_amount.toLocaleString('en-IN')}</td>
                                    <td>${p.payment_frequency}</td>
                                    <td>${p.next_due_date}</td>
                                    <td><span class="badge ${p.status === 'Active' ? 'badge-active' : (p.status === 'Renewal Due' ? 'badge-renewal-due' : 'badge-lapsed')}">${p.status}</span></td>
                                    <td>
                                        <button class="btn btn-outline btn-sm" onclick="App.openPolicyBondModal(${p.id})">
                                            <i class="fa-solid fa-certificate"></i> View Bond
                                        </button>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- Premium Payments History -->
            <div class="card" style="margin-bottom:1.5rem;">
                <div class="card-header">
                    <div class="card-title-group">
                        <h3>Premium Payment Receipts (${premiums.length})</h3>
                    </div>
                </div>
                <div class="table-responsive">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>Receipt #</th>
                                <th>Policy Number</th>
                                <th>Payment Date</th>
                                <th>Amount Paid</th>
                                <th>Payment Mode</th>
                                <th>Transaction Ref</th>
                                <th>Receipt</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${premiums.length === 0 ? '<tr><td colspan="7" style="text-align:center; padding:1.5rem;">No premium receipts found.</td></tr>' :
                            premiums.map(pr => `
                                <tr>
                                    <td><strong>${pr.receipt_no}</strong></td>
                                    <td>${pr.policy_number}</td>
                                    <td>${pr.payment_date}</td>
                                    <td><strong>₹${pr.amount.toLocaleString('en-IN')}</strong></td>
                                    <td><span class="badge badge-active">${pr.payment_method}</span></td>
                                    <td><code style="font-size:0.78rem;">${pr.transaction_id}</code></td>
                                    <td>
                                        <button class="btn btn-outline btn-sm" onclick="App.openReceiptModal(${pr.id})">
                                            <i class="fa-solid fa-receipt"></i> Print
                                        </button>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    },

    composeMessageForHolder(holderId) {
        this.navigateTo('communications');
        const select = document.getElementById('commHolderSelect');
        if (select) {
            select.value = holderId;
            this.applyCommunicationTemplate();
        }
    },

    // 4. PREMIUM COLLECTION SECTION
    renderPremiumsSection() {
        const premiums = DataManager.getPremiums();
        const policies = DataManager.getPolicies();

        // Calculate Totals
        const total = premiums.reduce((sum, p) => sum + p.amount, 0);
        const ledgerEl = document.getElementById('collectionTotalLedger');
        if (ledgerEl) ledgerEl.textContent = `₹${total.toLocaleString('en-IN')}`;

        const receiptsCountEl = document.getElementById('collectionReceiptsCount');
        if (receiptsCountEl) receiptsCountEl.textContent = premiums.length;

        // Populate Table
        const tbody = document.getElementById('premiumsHistoryTableBody');
        if (tbody) {
            tbody.innerHTML = premiums.map(p => `
                <tr>
                    <td><strong style="color:var(--primary);">${p.receipt_no}</strong></td>
                    <td>${p.policy_number}</td>
                    <td>${p.holder_name}</td>
                    <td>${p.payment_date}</td>
                    <td><strong>₹${p.amount.toLocaleString('en-IN')}</strong></td>
                    <td><span class="badge badge-active">${p.payment_method}</span></td>
                    <td><code style="font-size:0.78rem;">${p.transaction_id}</code></td>
                    <td>
                        <button class="btn btn-outline btn-sm" onclick="App.openReceiptModal(${p.id})">
                            <i class="fa-solid fa-receipt"></i> Receipt
                        </button>
                    </td>
                </tr>
            `).join('');
        }

        this.renderPaymentMethodChart();
    },

    renderPaymentMethodChart() {
        const canvas = document.getElementById('paymentMethodsChart');
        if (!canvas) return;

        const premiums = DataManager.getPremiums();
        const methods = {};
        premiums.forEach(p => methods[p.payment_method] = (methods[p.payment_method] || 0) + p.amount);

        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        const textColor = isDark ? '#CBD5E1' : '#475569';

        if (this.charts.paymentMethods) this.charts.paymentMethods.destroy();
        this.charts.paymentMethods = new Chart(canvas, {
            type: 'doughnut',
            data: {
                labels: Object.keys(methods),
                datasets: [{
                    data: Object.values(methods),
                    backgroundColor: ['#7C3AED', '#10B981', '#3B82F6', '#F59E0B', '#6366F1', '#EC4899'],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'right', labels: { color: textColor, boxWidth: 10, font: { size: 10 } } }
                }
            }
        });
    },

    // 5. RENEWAL MANAGEMENT SECTION
    renderRenewalsSection(filterStatus = 'ALL') {
        let renewals = DataManager.getRenewals();

        // Update top counter metrics
        const allCount = renewals.length;
        const dueCount = renewals.filter(r => r.status === 'Due').length;
        const overdueCount = renewals.filter(r => r.status === 'Overdue').length;
        const upcomingCount = renewals.filter(r => r.status === 'Upcoming').length;

        document.getElementById('renewalStatAll').textContent = allCount;
        document.getElementById('renewalStatDue').textContent = dueCount;
        document.getElementById('renewalStatOverdue').textContent = overdueCount;
        document.getElementById('renewalStatUpcoming').textContent = upcomingCount;

        if (filterStatus !== 'ALL') {
            renewals = renewals.filter(r => r.status === filterStatus);
        }

        const tbody = document.getElementById('renewalsTableBody');
        if (!tbody) return;

        if (renewals.length === 0) {
            tbody.innerHTML = `<tr><td colspan="9" style="text-align:center; padding:2rem; color:var(--text-muted);">No policies matching status "${filterStatus}".</td></tr>`;
            return;
        }

        tbody.innerHTML = renewals.map(r => {
            const statusBadge = r.status === 'Overdue' ? 'badge-lapsed' : (r.status === 'Due' ? 'badge-renewal-due' : 'badge-active');
            return `
                <tr>
                    <td><strong style="color:var(--primary);">${r.policy_number}</strong></td>
                    <td>
                        <strong>${r.holder_name}</strong>
                    </td>
                    <td>
                        <div>${r.holder_phone}</div>
                        <div style="font-size:0.75rem; color:var(--text-muted);">${r.holder_email}</div>
                    </td>
                    <td><strong>${r.renewal_date}</strong></td>
                    <td><span style="color:var(--danger); font-size:0.82rem;">${r.grace_period_end}</span></td>
                    <td><strong>₹${r.premium_due.toLocaleString('en-IN')}</strong></td>
                    <td><span class="badge ${statusBadge}">${r.status}</span></td>
                    <td>
                        <span class="badge ${r.reminder_sent ? 'badge-approved' : 'badge-renewal-due'}">
                            <i class="fa-solid fa-paper-plane"></i> ${r.reminder_count || 0} Sent
                        </span>
                    </td>
                    <td>
                        <div style="display:flex; gap:0.4rem;">
                            <button class="btn btn-outline btn-sm" onclick="App.sendQuickReminder(${r.id})" title="Send Reminder Notice">
                                <i class="fa-solid fa-bell"></i> Remind
                            </button>
                            <button class="btn btn-primary btn-sm" onclick="App.quickCollectRenewal(${r.policy_id})" title="Collect Premium">
                                <i class="fa-solid fa-receipt"></i> Pay
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');
    },

    filterRenewals(status) {
        this.renderRenewalsSection(status);
    },

    sendQuickReminder(renewalId) {
        const ren = DataManager.sendRenewalReminder(renewalId, 'SMS');
        if (ren) {
            this.showToast(`Renewal reminder sent to ${ren.holder_name} (${ren.holder_phone})!`, 'success');
            this.renderRenewalsSection();
            this.renderDashboard();
        }
    },

    quickCollectRenewal(policyId) {
        this.navigateTo('premiums');
        const select = document.getElementById('premPolicySelect');
        if (select) {
            select.value = policyId;
            this.previewPolicyForPremium(policyId);
        }
    },

    // 6. CLAIMS PROCESSING SECTION
    renderClaimsSection() {
        const claims = DataManager.getClaims();
        const tbody = document.getElementById('claimsTableBody');
        if (!tbody) return;

        tbody.innerHTML = claims.map(c => {
            let badgeClass = 'badge-submitted';
            if (c.status === 'Approved') badgeClass = 'badge-approved';
            else if (c.status === 'Settled') badgeClass = 'badge-settled';
            else if (c.status === 'Under Investigation') badgeClass = 'badge-investigation';
            else if (c.status === 'Rejected') badgeClass = 'badge-rejected';

            return `
                <tr>
                    <td><strong style="color:var(--primary);">${c.claim_number}</strong></td>
                    <td>${c.policy_number}</td>
                    <td><strong>${c.holder_name}</strong></td>
                    <td>${c.claim_type}</td>
                    <td><strong>₹${c.amount.toLocaleString('en-IN')}</strong></td>
                    <td>${c.claim_date}</td>
                    <td><span class="badge ${badgeClass}">${c.status}</span></td>
                    <td>
                        <button class="btn btn-outline btn-sm" onclick="App.openReviewClaimModal(${c.id})">
                            <i class="fa-solid fa-stamp"></i> Review
                        </button>
                    </td>
                </tr>
            `;
        }).join('');
    },

    openNewClaimModal() {
        this.populateDropdowns();
        const today = new Date().toISOString().split('T')[0];
        const dateInput = document.getElementById('claimIncidentDate');
        if (dateInput) dateInput.value = today;
        document.getElementById('newClaimModal').classList.add('active');
    },

    openReviewClaimModal(claimId) {
        const claim = DataManager.getClaims().find(c => c.id === claimId);
        if (!claim) return;

        document.getElementById('reviewClaimId').value = claim.id;
        const body = document.getElementById('reviewClaimModalBody');
        if (!body) return;

        body.innerHTML = `
            <div style="background:var(--bg-alt); padding:1rem; border-radius:var(--radius-md); margin-bottom:1.25rem;">
                <div class="cert-row"><span>Claim Number:</span><strong>${claim.claim_number}</strong></div>
                <div class="cert-row"><span>Policy Number:</span><strong>${claim.policy_number}</strong></div>
                <div class="cert-row"><span>Claimant Name:</span><strong>${claim.holder_name}</strong></div>
                <div class="cert-row"><span>Claim Type:</span><strong>${claim.claim_type}</strong></div>
                <div class="cert-row"><span>Claimed Amount:</span><strong style="color:var(--primary); font-size:1.1rem;">₹${claim.amount.toLocaleString('en-IN')}</strong></div>
                <div class="cert-row"><span>Incident Date:</span><strong>${claim.incident_date}</strong></div>
                <div class="cert-row" style="border-bottom:none;"><span>Uploaded Proofs:</span><strong>${claim.documents.join(', ')}</strong></div>
            </div>

            <div class="form-group" style="margin-bottom:1rem;">
                <label>Description / Incident Rationale</label>
                <div style="font-size:0.85rem; color:var(--text-secondary); background:var(--bg-main); padding:0.75rem; border-radius:var(--radius-sm); border:1px solid var(--border-color);">${claim.description}</div>
            </div>

            <div class="form-group" style="margin-bottom:1rem;">
                <label for="reviewClaimStatusSelect">Decision / Underwriting Status <span class="required">*</span></label>
                <select id="reviewClaimStatusSelect" class="form-control" required>
                    <option value="Submitted" ${claim.status === 'Submitted' ? 'selected' : ''}>Submitted</option>
                    <option value="Under Investigation" ${claim.status === 'Under Investigation' ? 'selected' : ''}>Under Investigation</option>
                    <option value="Approved" ${claim.status === 'Approved' ? 'selected' : ''}>Approved for Payout</option>
                    <option value="Settled" ${claim.status === 'Settled' ? 'selected' : ''}>Settled & Disbursed</option>
                    <option value="Rejected" ${claim.status === 'Rejected' ? 'selected' : ''}>Rejected / Ineligible</option>
                </select>
            </div>

            <div class="form-group">
                <label for="reviewClaimNotes">Assessor / Investigator Notes</label>
                <textarea id="reviewClaimNotes" class="form-control" rows="3">${claim.investigator_notes || ''}</textarea>
            </div>
        `;

        document.getElementById('reviewClaimModal').classList.add('active');
    },

    // 7. COMMUNICATIONS SECTION
    renderCommunicationsSection() {
        const comms = DataManager.getCommunications();
        const tbody = document.getElementById('commsLogTableBody');
        if (!tbody) return;

        tbody.innerHTML = comms.map(c => `
            <tr>
                <td><strong>${c.holder_name}</strong></td>
                <td><span class="badge badge-active">${c.type}</span></td>
                <td>
                    <strong>${c.subject}</strong>
                    <div style="font-size:0.75rem; color:var(--text-muted);">${c.message.substring(0, 75)}...</div>
                </td>
                <td style="font-size:0.78rem; color:var(--text-muted); white-space:nowrap;">${c.sent_date}</td>
            </tr>
        `).join('');
    },

    // 8. REPORTS & ANALYTICS SECTION
    renderReportsSection() {
        const policies = DataManager.getPolicies();
        const claims = DataManager.getClaims();

        // Calculations
        const totalSum = policies.reduce((s, p) => s + p.sum_assured, 0);
        const sumCr = (totalSum / 10000000).toFixed(2);
        const sumCrEl = document.getElementById('reportTotalSumAssured');
        if (sumCrEl) sumCrEl.textContent = `₹${sumCr} Cr`;

        const totalAnnualPrem = policies.reduce((s, p) => s + p.premium_amount, 0);
        const annualPremEl = document.getElementById('reportAnnualPremiums');
        if (annualPremEl) annualPremEl.textContent = `₹${totalAnnualPrem.toLocaleString('en-IN')}`;

        const settledClaims = claims.filter(c => c.status === 'Settled' || c.status === 'Approved').length;
        const ratio = claims.length > 0 ? ((settledClaims / claims.length) * 100).toFixed(1) : 100;
        const ratioEl = document.getElementById('reportSettlementRatio');
        if (ratioEl) ratioEl.textContent = `${ratio}%`;

        // Master Register Table
        const tbody = document.getElementById('reportsMasterTableBody');
        if (tbody) {
            tbody.innerHTML = policies.map(p => `
                <tr>
                    <td><strong style="color:var(--primary);">${p.policy_number}</strong></td>
                    <td>${p.holder_name}</td>
                    <td>${p.plan_name}</td>
                    <td>${p.policy_type}</td>
                    <td><strong>₹${p.sum_assured.toLocaleString('en-IN')}</strong></td>
                    <td>₹${p.premium_amount.toLocaleString('en-IN')}</td>
                    <td>${p.payment_frequency}</td>
                    <td>${p.end_date}</td>
                    <td><span class="badge ${p.status === 'Active' ? 'badge-active' : 'badge-renewal-due'}">${p.status}</span></td>
                </tr>
            `).join('');
        }

        this.renderReportCharts();
    },

    renderReportCharts() {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        const textColor = isDark ? '#CBD5E1' : '#475569';

        // Claims breakdown
        const claimsCanvas = document.getElementById('claimsAnalyticsChart');
        if (claimsCanvas) {
            const claims = DataManager.getClaims();
            const counts = {};
            claims.forEach(c => counts[c.status] = (counts[c.status] || 0) + 1);

            if (this.charts.claimsChart) this.charts.claimsChart.destroy();
            this.charts.claimsChart = new Chart(claimsCanvas, {
                type: 'doughnut',
                data: {
                    labels: Object.keys(counts),
                    datasets: [{
                        data: Object.values(counts),
                        backgroundColor: ['#10B981', '#3B82F6', '#F59E0B', '#EF4444'],
                        borderWidth: 0
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { position: 'bottom', labels: { color: textColor } }
                    }
                }
            });
        }

        // Frequency breakdown
        const freqCanvas = document.getElementById('frequencyChart');
        if (freqCanvas) {
            const policies = DataManager.getPolicies();
            const freqCounts = {};
            policies.forEach(p => freqCounts[p.payment_frequency] = (freqCounts[p.payment_frequency] || 0) + 1);

            if (this.charts.freqChart) this.charts.freqChart.destroy();
            this.charts.freqChart = new Chart(freqCanvas, {
                type: 'bar',
                data: {
                    labels: Object.keys(freqCounts),
                    datasets: [{
                        label: 'Policies',
                        data: Object.values(freqCounts),
                        backgroundColor: '#8B5CF6',
                        borderRadius: 6
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: {
                        x: { ticks: { color: textColor } },
                        y: { ticks: { color: textColor, stepSize: 1 } }
                    }
                }
            });
        }
    },

    // =========================================================================
    // MODAL HANDLERS (CERTIFICATES & RECEIPTS)
    // =========================================================================
    openPolicyBondModal(policyId) {
        const policy = DataManager.getPolicies().find(p => p.id === policyId);
        if (!policy) return;

        const holder = DataManager.getHolderById(policy.holder_id);
        const modalBody = document.getElementById('policyBondModalBody');
        if (!modalBody) return;

        modalBody.innerHTML = `
            <div class="printable-certificate">
                <div class="cert-header">
                    <h2>LIFE INSURANCE CORPORATION (LIC)</h2>
                    <p>Operating under Data Alcott Systems · Task ID: WD-LIC-002</p>
                    <div class="cert-title-badge">OFFICIAL POLICY BOND CONTRACT</div>
                </div>

                <div class="cert-grid">
                    <div>
                        <div class="cert-row"><span>Policy Number:</span><strong>${policy.policy_number}</strong></div>
                        <div class="cert-row"><span>Life Assured:</span><strong>${policy.holder_name}</strong></div>
                        <div class="cert-row"><span>Client Code:</span><strong>${holder ? holder.holderCode : 'PH-1000'}</strong></div>
                        <div class="cert-row"><span>PAN Number:</span><strong>${holder ? holder.pan : 'PAN-EXEMPT'}</strong></div>
                        <div class="cert-row"><span>Residential City:</span><strong>${holder ? holder.city : 'Chennai'}</strong></div>
                    </div>
                    <div>
                        <div class="cert-row"><span>Insurance Plan:</span><strong>${policy.plan_name}</strong></div>
                        <div class="cert-row"><span>Plan Category:</span><strong>${policy.policy_type}</strong></div>
                        <div class="cert-row"><span>Sum Assured (Cover):</span><strong style="color:#7C3AED; font-size:1.1rem;">₹${policy.sum_assured.toLocaleString('en-IN')}</strong></div>
                        <div class="cert-row"><span>Premium Instalment:</span><strong>₹${policy.premium_amount.toLocaleString('en-IN')}</strong></div>
                        <div class="cert-row"><span>Payment Frequency:</span><strong>${policy.payment_frequency}</strong></div>
                    </div>
                </div>

                <div class="cert-grid" style="border-top:1px dashed #CBD5E1; padding-top:1rem;">
                    <div>
                        <div class="cert-row"><span>Commencement Date:</span><strong>${policy.start_date}</strong></div>
                        <div class="cert-row"><span>Maturity Expiry Date:</span><strong>${policy.end_date}</strong></div>
                        <div class="cert-row"><span>Policy Term:</span><strong>${policy.term} Years</strong></div>
                    </div>
                    <div>
                        <div class="cert-row"><span>Nominee Name:</span><strong>${holder ? holder.nominee : 'Not Registered'}</strong></div>
                        <div class="cert-row"><span>Nominee Relation:</span><strong>${holder ? holder.nominee_relation : 'N/A'}</strong></div>
                        <div class="cert-row"><span>Underwriting Status:</span><strong style="color:#10B981;">VERIFIED & IN FORCE</strong></div>
                    </div>
                </div>

                <div class="cert-signatures">
                    <div class="sign-box">
                        <strong>Kavitha Ramachandran</strong>
                        <div>Claims & Underwriting Manager</div>
                    </div>
                    <div class="sign-box">
                        <strong>Rajesh Sharma</strong>
                        <div>Senior Branch Administrator</div>
                    </div>
                </div>
            </div>
        `;

        document.getElementById('policyBondModal').classList.add('active');
    },

    openReceiptModal(receiptId) {
        const receipt = DataManager.getPremiums().find(r => r.id === receiptId);
        if (!receipt) return;

        const modalBody = document.getElementById('receiptModalBody');
        if (!modalBody) return;

        modalBody.innerHTML = `
            <div class="printable-certificate" style="border:4px solid #10B981;">
                <div class="cert-header" style="border-bottom-color:#10B981;">
                    <h2 style="color:#10B981;">PREMIUM PAYMENT RECEIPT</h2>
                    <p>Data Alcott Systems · PolicyPro Billing Division</p>
                    <div class="cert-title-badge" style="background:#D1FAE5; color:#059669;">TRANSACTION RECONCILED</div>
                </div>

                <div class="cert-row"><span>Receipt Number:</span><strong style="color:var(--primary);">${receipt.receipt_no}</strong></div>
                <div class="cert-row"><span>Policy Number:</span><strong>${receipt.policy_number}</strong></div>
                <div class="cert-row"><span>Policy Holder Name:</span><strong>${receipt.holder_name}</strong></div>
                <div class="cert-row"><span>Payment Date:</span><strong>${receipt.payment_date}</strong></div>
                <div class="cert-row"><span>Payment Mode:</span><strong>${receipt.payment_method}</strong></div>
                <div class="cert-row"><span>Transaction / UTR Ref:</span><strong>${receipt.transaction_id}</strong></div>
                <div class="cert-row" style="font-size:1.15rem; padding:0.75rem 0;">
                    <span>Total Amount Received:</span>
                    <strong style="color:#10B981;">₹${receipt.amount.toLocaleString('en-IN')}</strong>
                </div>

                <div style="font-size:0.75rem; color:#64748B; margin-top:1.25rem; text-align:center;">
                    This is a digitally generated valid tax receipt under Section 80C of the Income Tax Act.
                </div>

                <div class="cert-signatures" style="margin-top:1.5rem;">
                    <div class="sign-box" style="margin:0 auto;">
                        <strong>Accounts Officer</strong>
                        <div>DAS Life Insurance Services</div>
                    </div>
                </div>
            </div>
        `;

        document.getElementById('receiptModal').classList.add('active');
    },

    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) modal.classList.remove('active');
    },

    // =========================================================================
    // EXPORT FUNCTIONS (CSV)
    // =========================================================================
    downloadCSV(csvContent, filename) {
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        this.showToast(`Exported ${filename} successfully!`, 'success');
    },

    exportHoldersCSV() {
        const holders = DataManager.getHolders();
        let csv = 'Holder ID,Name,Email,Phone,PAN,City,State,Occupation,Income,Nominee,Nominee Relation,Registered Date\n';
        holders.forEach(h => {
            csv += `"${h.holderCode}","${h.name}","${h.email}","${h.phone}","${h.pan}","${h.city}","${h.state}","${h.occupation}",${h.income},"${h.nominee}","${h.nominee_relation}","${h.registered_date}"\n`;
        });
        this.downloadCSV(csv, 'policy_holders_export.csv');
    },

    exportPoliciesCSV() {
        const policies = DataManager.getPolicies();
        let csv = 'Policy Number,Holder Name,Plan Name,Category,Sum Assured,Premium,Frequency,Term,Start Date,End Date,Next Due Date,Status\n';
        policies.forEach(p => {
            csv += `"${p.policy_number}","${p.holder_name}","${p.plan_name}","${p.policy_type}",${p.sum_assured},${p.premium_amount},"${p.payment_frequency}",${p.term},"${p.start_date}","${p.end_date}","${p.next_due_date}","${p.status}"\n`;
        });
        this.downloadCSV(csv, 'insurance_policies_export.csv');
    },

    exportPremiumsCSV() {
        const premiums = DataManager.getPremiums();
        let csv = 'Receipt No,Policy Number,Holder Name,Payment Date,Amount Paid,Method,Transaction ID,Status\n';
        premiums.forEach(pr => {
            csv += `"${pr.receipt_no}","${pr.policy_number}","${pr.holder_name}","${pr.payment_date}",${pr.amount},"${pr.payment_method}","${pr.transaction_id}","${pr.status}"\n`;
        });
        this.downloadCSV(csv, 'premium_collections_export.csv');
    },

    // =========================================================================
    // TOAST NOTIFICATION UTILITY
    // =========================================================================
    showToast(message, type = 'info', title = '') {
        const container = document.getElementById('toastContainer');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = `toast ${type}`;

        let icon = 'fa-info-circle';
        if (type === 'success') icon = 'fa-circle-check';
        else if (type === 'danger') icon = 'fa-triangle-exclamation';
        else if (type === 'warning') icon = 'fa-bell';

        toast.innerHTML = `
            <div class="toast-icon"><i class="fa-solid ${icon}"></i></div>
            <div class="toast-content">
                <h5>${title || (type.charAt(0).toUpperCase() + type.slice(1))}</h5>
                <p>${message}</p>
            </div>
        `;

        container.appendChild(toast);

        setTimeout(() => {
            toast.classList.add('hide');
            setTimeout(() => toast.remove(), 300);
        }, 4000);
    }
};

// Initialize Application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});


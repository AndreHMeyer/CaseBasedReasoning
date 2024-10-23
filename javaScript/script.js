var script = {
    init: function () {
        document.getElementById('generateResults').addEventListener('click', this.generateResults);
    },
    

    calcularPorcentagens: function (data) {
        let total = 0;
        let _heartAtack = 0;
        let _noHeartAtack = 0;
        let _sex0 = 0;
        let _sex1 = 0;

        // Percorre a matriz
        console.log(data)
        data.forEach(obj => {
            total++; // Conta o total de objetos
            if (obj.sex === 1) {
                _sex1++;
            }

            if (obj.sex === 0) {
                _sex0++;
            }

            if (obj.output === 1) {
                _heartAtack++; // Conta os outputs 1
            } else if (obj.output === 0) {
                _noHeartAtack++; // Conta os outputs 0
            }
        });

        // Calcula as porcentagens
        const heartAtack = ((_heartAtack / total) * 100).toFixed(2); // Para duas casas decimais
        const noHeartAtack = ((_noHeartAtack / total) * 100).toFixed(2); // Para duas casas decimais

        const sex0 = ((_sex0 / total) * 100).toFixed(2); // Para duas casas decimais
        const sex1 = ((_sex1 / total) * 100).toFixed(2); // Para duas casas decimais

        return {
            heartAtack,
            noHeartAtack,
            sex0,
            sex1
        };
    },

    generateResults: function () {
        var formData = {
            //Atributos
            age: document.getElementById('ageInput').value,
            sex: document.getElementById('genderDropdown').value === 'Masculino' ? 1 : 0, // 1 = Masculino, 0 = Feminino
            cp: document.getElementById('chestPainDropdown').value, // Tipos de dor no peito
            trtbps: document.getElementById('restingBloodPressureInput').value, // Pressão arterial
            chol: document.getElementById('cholesterolInput').value, // Colesterol
            fbs: document.getElementById('fastingBloodSugarCheck').checked ? 1 : 0, // Glicemia em jejum
            restecg: document.getElementById('restingEcgCheck').checked ? 1 : 0, // Eletrocardiograma em repouso
            thalachh: document.getElementById('maxHeartRateInput').value, // Frequência cardíaca máxima
            exng: document.getElementById('exerciseAnginaCheck').checked ? 1 : 0, // Angina induzida por exercício
            oldpeak: document.getElementById('previousPeakInput').value, // Depressão do ST
            slp: document.getElementById('slopeInput').value, // Declive da curva
            caa: document.getElementById('numVesselsInput').value, // Número de vasos principais
            thall: document.getElementById('thalInput').value // Taxa Thal
        };

        var weights = {
            age: parseFloat(document.getElementById('ageWeightInput').value), // Peso para idade
            sex: parseFloat(document.getElementById('genderWeightInput').value), // Peso para sexo
            cp: parseFloat(document.getElementById('chestPainWeightInput').value), // Peso para dor no peito
            trtbps: parseFloat(document.getElementById('restingBloodPressureWeightInput').value), // Peso para pressão arterial
            chol: parseFloat(document.getElementById('cholesterolWeightInput').value), // Peso para colesterol
            fbs: parseFloat(document.getElementById('fastingBloodSugarWeightInput').value), // Peso para glicemia em jejum
            restecg: parseFloat(document.getElementById('restingElectrocardiographicWeightInput').value), // Peso para eletrocardiograma em repouso
            thalachh: parseFloat(document.getElementById('maximumHeartRateWeightInput').value), // Peso para frequência cardíaca máxima
            exng: parseFloat(document.getElementById('exerciseInducedAnginaWeightInput').value), // Peso para angina induzida por exercício
            oldpeak: parseFloat(document.getElementById('previousPeakWeightInput').value), // Peso para depressão do ST
            slp: parseFloat(document.getElementById('slopeWeightInput').value), // Peso para declive da curva
            caa: parseFloat(document.getElementById('numberOfMajorVesselsWeightInput').value), // Peso para número de vasos principais
            thall: parseFloat(document.getElementById('thalRateWeightInput').value) // Peso para taxa Thal
        };

        fetch('../data/database.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erro ao ler o arquivo JSON: ' + response.statusText);
                }
                return response.json();
            })
            .then(jsonDatabase => {
                let results = jsonDatabase.map(caseData => {
                    let finalSimilarity = script.calculateWeightedSimilarity(formData, caseData, weights);
                    return { caseData, similarity: finalSimilarity };
                });

                const { heartAtack, noHeartAtack, sex0, sex1} = script.calcularPorcentagens(jsonDatabase)

                console.log(heartAtack, noHeartAtack,  sex0, sex1)

                    const data = {
                        labels: ['No Attack', 'Heart Attack'],
                        datasets: [{
                            label: 'Heart Attack Distribution',
                            data: [heartAtack, noHeartAtack], // Percentuais que você deseja exibir
                            backgroundColor: ['#ADD8E6', '#FFB347'], // Cores pastel
                            hoverOffset: 4
                        }]
                    };

                    // Configurações do gráfico
                    const config = {
                        type: 'pie',
                        data: data,
                        options: {
                            plugins: {
                                tooltip: {
                                    callbacks: {
                                        label: function(tooltipItem) {
                                            return tooltipItem.label + ': ' + tooltipItem.raw + '%';
                                        }
                                    }
                                }
                            },
                            responsive: false,
                            maintainAspectRatio: false,
                            title: {
                                display: true,
                                text: 'Target Distribution',
                                fontSize: 18,
                                fontWeight: 'bold'
                            }
                        }
                    };

                    new Chart(
                        document.getElementById('myPieChart'),
                        config
                     );
                
                const data2 = {
                        labels: ['Sex 0', 'Sex 1'],
                        datasets: [{
                            label: 'Sex Distribution',
                            data: [sex0, sex1], // Percentuais que você deseja exibir
                            backgroundColor: ['#ADD8E6', '#FFB347'], // Cores pastel
                            hoverOffset: 4
                        }]
                    };

                    // Configurações do gráfico
                    const config2 = {
                        type: 'pie',
                        data: data2,
                        options: {
                            plugins: {
                                tooltip: {
                                    callbacks: {
                                        label: function(tooltipItem) {
                                            return tooltipItem.label + ': ' + tooltipItem.raw + '%';
                                        }
                                    }
                                }
                            },
                            responsive: false,
                            maintainAspectRatio: false,
                            title: {
                                display: true,
                                text: 'Sex Distribution',
                                fontSize: 18,
                                fontWeight: 'bold'
                            }
                        }
                    };

                    new Chart(
                        document.getElementById('myPieChart2'),
                        config2
                    );
                
                // Preenchimento dos dados de entrada
                const entryDataBody = document.getElementById('entryDataBody');
                entryDataBody.innerHTML = '';

                const entryRow = document.createElement('tr');
                entryRow.innerHTML = `
                    <td>${formData.age}</td>
                    <td>${formData.sex === 1 ? 'Masculino' : 'Feminino'}</td>
                    <td>${formData.cp}</td>
                    <td>${formData.trtbps}</td>
                    <td>${formData.chol}</td>
                    <td>${formData.fbs === 1 ? 'Sim' : 'Não'}</td>
                    <td>${formData.restecg}</td>
                    <td>${formData.thalachh}</td>
                    <td>${formData.exng  === 1 ? 'Sim' : 'Não'}</td>
                    <td>${formData.oldpeak}</td>
                    <td>${formData.slp}</td>
                    <td>${formData.caa}</td>
                    <td>${formData.thall}</td>
                    <td>${results[0].caseData.output === 1 ? 'Sim' : 'Não'}</td>
                `;
                
                entryDataBody.appendChild(entryRow); 

                //Preenchimento dos dados do json
                results.sort((a, b) => b.similarity - a.similarity);

                const resultsBody = document.getElementById('resultsBody');
                resultsBody.innerHTML = ''; 

                const chestPainTypeNames = {
                    0: "Angina típica",
                    1: "Angina atípica",
                    2: "Dor não anginosa",
                    3: "Assintomático"
                };

                results.forEach(result => {
                    const row = document.createElement('tr');

                    row.innerHTML = `
                        <td>${result.caseData.age}</td>
                        <td>${result.caseData.sex === 1 ? 'Masculino' : 'Feminino'}</td>
                        <td>${chestPainTypeNames[result.caseData.cp] || result.caseData.cp}</td>
                        <td>${result.caseData.trtbps}</td>
                        <td>${result.caseData.chol}</td>
                        <td>${result.caseData.fbs === 1 ? 'Sim' : 'Não'}</td>
                        <td>${result.caseData.restecg}</td>
                        <td>${result.caseData.thalachh}</td>
                        <td>${result.caseData.exng === 1 ? 'Sim' : 'Não'}</td>
                        <td>${result.caseData.oldpeak}</td>
                        <td>${result.caseData.slp}</td>
                        <td>${result.caseData.caa}</td>
                        <td>${result.caseData.thall}</td>
                        <td>${result.caseData.output === 1 ? 'Sim' : 'Não'}</td>
                        <td>${result.similarity.toFixed(2)}</td>
                    `;

                    resultsBody.appendChild(row);
                });
            })
            .catch(error => {
                alert('Erro ao ler o arquivo JSON: ' + error.message);
            });            
    },

    calculateWeightedSimilarity: function (formData, caseData, weights) {
        let totalSimilarity = 0;
        let totalWeight = 0;

        for (let attribute in formData) {
            let formValue = formData[attribute];
            let caseValue = caseData[attribute];
            let weight = weights[attribute];

            let value = this.calculateSimilarity(attribute, formValue, caseValue);
            totalSimilarity += value * weight;
            totalWeight += weight;
        }

        return totalWeight > 0 ? totalSimilarity / totalWeight : 0;
    },

    calculateSimilarity: function (attribute, formValue, caseValue) {

        switch (attribute) {
            case 'age':
                return script.getAgeValue(formValue, caseValue) //ageValue
            case 'sex':
                return formValue == caseValue ? 1 : 0; //genderValue
            case 'cp':
                return script.getChestPainValue(formValue, caseValue); //chestPainValue
            case 'trtbps':
                return script.getRestingBloodPressureValue(formValue, caseValue); //restingBloodPressureValue
            case 'chol':
                return script.getCholestoralInMgValue(formValue, caseValue); //cholestoralInMgValue
            case 'fbs':
                return formValue == caseValue ? 1 : 0; //fastingBloodSugarValue
            case 'restecg':
                return script.getRestingElectrocardiographValue(formValue, caseValue); //restingElectrocardiographicResultsValue
            case 'thalachh':
                return script.getMaximumHeartRateAchievedValue(formValue, caseValue); //maximumHeartRateAchievedValue
            case 'exng':
                return formValue == caseValue ? 1 : 0; //exerciseInducedAnginaValue   
            case 'oldpeak':
                return script.getOldPeakValue(formValue, caseValue); //previousPeakValue      
            case 'slp':
                return script.getSlopeValue(formValue, caseValue); //slopeValue
            case 'caa':
                return script.getMajorVesselsValue(formValue, caseValue); //majorVesselsValue
            case 'thall':
                return script.getThallRateValue(formValue, caseValue); //thallRateValue               
            default:
                return 0;
        }
    },

    getAgeValue: function (ageValueForm, caseValue) {
        const ageValues = [
            { range: "29-40", value: 0, min: 29, max: 40 },
            { range: "41-60", value: 1, min: 41, max: 60 },
            { range: "61-77", value: 2, min: 61, max: 77 }
        ];
    
        function getValueFromAge(ageValue) {
            for (const range of ageValues) {
                if (ageValue > range.max) {
                    return range.value; 
                } else if (ageValue >= range.min && ageValue <= range.max) {
                    return range.value; 
                }
            }
            return null;
        }
    
        const valueForm = getValueFromAge(ageValueForm);
        const valueJson = getValueFromAge(caseValue);
    
        if (valueForm === null || valueJson === null) {
            return 0;
        }
    
        const value = 1 - (Math.abs(valueForm - valueJson) / ageValues.length);
    
        return parseFloat(value.toFixed(2));
    },

    getChestPainValue: function (chestPainTypeForm, caseValue) {
        const chestPainTypeValues = {
            "Typical angina": {
                "Typical angina": 1,
                "Atypical angina": 0.7,
                "Non-angina pain": 0.3,
                "Asymptomatic": 0
            },
            "Atypical angina": {
                "Typical angina": 0.7,
                "Atypical angina": 1,
                "Non-angina pain": 0.5,
                "Asymptomatic": 0.2
            },
            "Non-angina pain": {
                "Typical angina": 0.3,
                "Atypical angina": 0.5,
                "Non-angina pain": 1,
                "Asymptomatic": 0.4
            },
            "Asymptomatic": {
                "Typical angina": 0,
                "Atypical angina": 0.2,
                "Non-angina pain": 0.4,
                "Asymptomatic": 1
            }
        };
    
        if (chestPainTypeValues[chestPainTypeForm] && caseValue in chestPainTypeValues[chestPainTypeForm]) {
            return chestPainTypeValues[chestPainTypeForm][caseValue];
        }
    
        return 0;
    },

    getSlopeValue: function (slopeValueForm, caseValue) {
        const slopeValues = {
            0: {
                0: 1,
                1: 0.7,
                2: 0.3
            },
            1: {
                0: 0.5,
                1: 1,
                2: 0.5
            },
            2: {
                0: 0.3,
                1: 0.7,
                2: 1
            }
        };
    
        if (slopeValues[slopeValueForm] && caseValue in slopeValues[slopeValueForm]) {
            return slopeValues[slopeValueForm][caseValue];
        }
    
        return 0;
    },

    getMajorVesselsValue: function (majorVesselsValueForm, caseValue) {
        const majorVesselsValues = {
            0: {
                0: 1,
                1: 0.7,
                2: 0.4,
                3: 0.1
            },
            1: {
                0: 0.5,
                1: 1,
                2: 0.7,
                3: 0.2
            },
            2: {
                0: 0.2,
                1: 0.7,
                2: 1,
                3: 0.7
            },
            3: {
                0: 0.2,
                1: 0.4,
                2: 0.7,
                3: 1,
            }
        };
    
        if (majorVesselsValues[majorVesselsValueForm] && caseValue in majorVesselsValues[majorVesselsValueForm]) {
            return majorVesselsValues[majorVesselsValueForm][caseValue];
        }
    
        return 0;
    },

    getThallRateValue: function (thallRateValueForm, caseValue) {
        const thallRateValues = {
            0: {
                0: 1,
                1: 0.7,
                2: 0.4,
                3: 0.1
            },
            1: {
                0: 0.5,
                1: 1,
                2: 0.7,
                3: 0.2
            },
            2: {
                0: 0.2,
                1: 0.7,
                2: 1,
                3: 0.7
            },
            3: {
                0: 0.2,
                1: 0.4,
                2: 0.7,
                3: 1,
            }
        };
    
        if (thallRateValues[thallRateValueForm] && caseValue in thallRateValues[thallRateValueForm]) {
            return thallRateValues[thallRateValueForm][caseValue];
        }
    
        return 0;
    },

    getRestingBloodPressureValue: function (restingBloodPressureValueForm, caseValue) {
        const restingBloodPressureValues = [
            { range: "94-110", value: 0, min: 94, max: 110 },
            { range: "111-130", value: 1, min: 111, max: 130 },
            { range: "131-150", value: 2, min: 131, max: 150 },
            { range: "151-170", value: 3, min: 151, max: 170 },
            { range: "171-200", value: 4, min: 171, max: 200 }
        ];

        function getValueFromPressure(pressureValue) {
            for (const range of restingBloodPressureValues) {
                if (pressureValue > range.max){
                    return range.value;
                } else if (pressureValue >= range.min && pressureValue <= range.max){
                    return range.value;
                }               
            }
            return null; 
        }
    
        const valueForm = getValueFromPressure(restingBloodPressureValueForm);
        const valueJson = getValueFromPressure(caseValue);
    
        if (valueForm === null || valueJson === null) {
            return 0;
        }
    
        const value = 1 - (Math.abs(valueForm - valueJson) / restingBloodPressureValues.length);
    
        return parseFloat(value.toFixed(2));
    },

    getCholestoralInMgValue: function (cholestoralInMgValueForm, caseValue) {
        const cholestoralInMgValues = [
            { range: "126-199", value: 0, min: 126, max: 199 },
            { range: "200-239", value: 1, min: 200, max: 239 },
            { range: "240-279", value: 2, min: 240, max: 279 },
            { range: "280-319", value: 3, min: 280, max: 319 },
            { range: "320-399", value: 4, min: 320, max: 399 },
            { range: "400-564", value: 5, min: 400, max: 564 }
        ];
    
        function getValueFromCholestoral(cholesterolValue) {
            for (const range of cholestoralInMgValues) {
                if(cholesterolValue > range.max){
                    return range.value;
                } else if(cholesterolValue >= range.min && cholesterolValue <= range.max) {
                    return range.value;
                }
            }
            return null; 
        }
    
        const valueForm = getValueFromCholestoral(cholestoralInMgValueForm);
        const valueJson = getValueFromCholestoral(caseValue);
    
        if (valueForm === null || valueJson === null) {
            return 0;
        }
    
        const value = 1 - (Math.abs(valueForm - valueJson) / cholestoralInMgValues.length);
    
        return parseFloat(value.toFixed(2));
    },

    getRestingElectrocardiographValue: function (restingElectrocardiographValueForm, caseValue) {
        const RestingElectrocardiographValues = {
            0: {
                0: 1,
                1: 0.7,
                2: 0.3
            },
            1: {
                0: 0.5,
                1: 1,
                2: 0.5
            },
            2: {
                0: 0.3,
                1: 0.7,
                2: 1
            }
        };
    
        if (RestingElectrocardiographValues[restingElectrocardiographValueForm] && caseValue in RestingElectrocardiographValues[restingElectrocardiographValueForm]) {
            return RestingElectrocardiographValues[restingElectrocardiographValueForm][caseValue];
        }
    
        return 0;
    },
    
    getMaximumHeartRateAchievedValue: function (maximumHeartRateAchievedValueForm, caseValue) {
        const maximumHeartRateAchieveValues = [
            { range: "71-90", value: 0, min: 71, max: 90 },
            { range: "91-110", value: 1, min: 91, max: 110 },
            { range: "111-130", value: 2, min: 111, max: 130 },
            { range: "131-150", value: 3, min: 131, max: 150 },
            { range: "151-170", value: 4, min: 151, max: 170 },
            { range: "171-202", value: 5, min: 171, max: 202 }
        ];
    
        function getValueFromMaximumHeartRate(maximumHeartRateAchievedValue) {
            for (const range of maximumHeartRateAchieveValues) {
                if (maximumHeartRateAchieveValues > range.max) {
                    return range.value;
                } else if (maximumHeartRateAchievedValue >= range.min && maximumHeartRateAchievedValue <= range.max) {
                    return range.value;
                }
            }
            return null; 
        }
    
        const valueForm = getValueFromMaximumHeartRate(maximumHeartRateAchievedValueForm);
        const valueJson = getValueFromMaximumHeartRate(caseValue);
    
        if (valueForm === null || valueJson === null) {
            return 0;
        }
    
        const value = 1 - (Math.abs(valueForm - valueJson) / maximumHeartRateAchieveValues.length);
    
        return parseFloat(value.toFixed(2));
    },

    getOldPeakValue: function (oldPeakValueForm, caseValue) {
        const oldPeakValues = [
            { range: "0.0-1.0", value: 0, min: 0.0, max: 1.0 },
            { range: "1.1-2.0", value: 1, min: 1.1, max: 2.0 },
            { range: "2.1-3.0", value: 2, min: 2.1, max: 3.0 },
            { range: "3.1-4.0", value: 3, min: 3.1, max: 4.0 },
            { range: "4.1-5.0", value: 4, min: 4.1, max: 5.0 },
            { range: "5.1-6.2", value: 5, min: 5.1, max: 6.2 }
        ];
   
        function getValueFromOldPeak(oldPeakValue) {
            for (const range of oldPeakValues) {
                if (oldPeakValue > range.max) {
                    return range.value
                } else if (oldPeakValue >= range.min && oldPeakValue <= range.max) {
                    return range.value;
                }
            }
            return null; 
        }
    
        const valueForm = getValueFromOldPeak(oldPeakValueForm);
        const valueJson = getValueFromOldPeak(caseValue);
    
        if (valueForm === null || valueJson === null) {
            return 0;
        }
    
        const value = 1 - (Math.abs(valueForm - valueJson) / oldPeakValues.length);
    
        return parseFloat(value.toFixed(2));
    },  
};

window.onload = function () {
    script.init();
};

document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("generateResults").addEventListener("click", function() {
        validateForm();
    });

    function validateForm() {
        const fields = [
            'ageInput', 'genderDropdown', 'chestPainDropdown',
            'restingBloodPressureInput', 'cholesterolInput',
            'maxHeartRateInput', 'previousPeakInput',
            'slopeInput', 'numVesselsInput', 'thalInput',
            'ageWeightInput', 'genderWeightInput', 'chestPainWeightInput',
            'restingBloodPressureWeightInput', 'cholesterolWeightInput',
            'fastingBloodSugarWeightInput', 'restingElectrocardiographicWeightInput',
            'maximumHeartRateWeightInput', 'exerciseInducedAnginaWeightInput',
            'previousPeakWeightInput', 'slopeWeightInput',
            'numberOfMajorVesselsWeightInput', 'thalRateWeightInput'
        ];

        let isValid = true;

        fields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            const value = field.value.trim();

            field.classList.remove('is-invalid');
            field.nextElementSibling.classList.add('d-none');

            if (!value) {
                isValid = false;
                field.classList.add('is-invalid');
                field.nextElementSibling.classList.remove('d-none');
            } else if (fieldId.includes("Weight")) { 
                const numericValue = parseFloat(value);
                if (isNaN(numericValue) || numericValue < 0 || numericValue > 1) {
                    isValid = false;
                    field.classList.add('is-invalid');
                    field.nextElementSibling.classList.remove('d-none');
                    field.nextElementSibling.textContent = 'O valor deve estar entre 0 e 1.';
                }
            }
        });

        return isValid;
    }
});

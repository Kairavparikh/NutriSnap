window.addEventListener("load", function () {
    let classifier, label, prob;
    const image = new Image(500, 500);

    function setup() {
        image.src = "food.png"; 
        image.onload = function () {
            document.body.appendChild(image);

            ml5.imageClassifier("MobileNet")
                .then(c => {
                    classifier = c;
                    classifyImage();
                })
                .catch(err => {
                    console.error("Error loading model:", err);
                });
        };
    }

    function classifyImage() {
        classifier.classify(image)
            .then(results => {
                gotResults(null, results);
            })
            .catch(err => {
                gotResults(err, null);
            });
    }

    function gotResults(err, results) {
        if (err) {
            console.error("Classification error:", err);
            return;
        }

        console.log(results);
        label = results[0].label;
        prob = (results[0].confidence * 100).toFixed(2);
        document.getElementById("output").innerHTML = "Prediction: " + label;
        document.getElementById("output2").innerHTML = "Confidence: " + prob + "%";
    }

    setup();
});

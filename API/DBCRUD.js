const pool = require('../config/db.config');

//update atf and jtf
exports.updateInsciption = async function(req, res) {

    if (req.body.atf && req.body.jtf) {
        pool.query(`SELECT * FROM inscriptions where artifact_id = ${req.params.id} AND is_latest = 1 `, (err, rows, fields) => {
            if (!err) {
                const atf = req.body.atf;
                const jtf = req.body.jtf;
                const inscription_ID = rows[0].id;
                insertNewInscription(req.params.id, atf, jtf, rows)
                    .then(function(isInserted) {
                        console.log("printing" + isInserted);
                        if (isInserted) {
                            upadteOLDInscription(inscription_ID).then((isUpdated) => {
                                if (isUpdated) {
                                    res.send("Data Inserted successfully");
                                } else {
                                    res.send("Old Inscription not updated");
                                }
                            })
                        } else {
                            res.send("New inscription not inserted");
                        }
                    })
                    .catch(function(e) {
                        console.log("Catch handler " + e)
                    });
            } else {
                console.log(err);
            }
        })
    } else {
        res.send("NO ATF and No JTF");
    }
}

insertNewInscription = (id, atf, jtf, old_ins) => {
    return new Promise((resolve, reject) => {
        const data = old_ins[0];
        var values = [id, atf, jtf,
            data.transliteration,
            data.transliteration_clean,
            data.transliteration_sign_names,
            data.transliteration_for_search,
            data.annotation,
            data.is_atf2conll_diff_resolved,
            data.comments,
            data.structure,
            data.translation,
            data.transcription,
            data.update_event_id,
            data.inscription_comments,
            1
        ]
        pool.query(`INSERT into inscriptions(artifact_id,atf,jtf,transliteration,transliteration_clean,transliteration_sign_names,transliteration_for_search,annotation,is_atf2conll_diff_resolved,comments,structure,translation,transcription,update_event_id,inscription_comments,is_latest) VALUES (?)`,
            [values], (err, result) => {
                if (!err) {
                    console.log(result);
                    resolve(true);
                } else {
                    console.log(err);
                    resolve(false);
                }
            })
    })

}

upadteOLDInscription = (id) => {
    return new Promise((resolve, reject) => {
        pool.query(`UPDATE inscriptions SET is_latest = 0 where id=${id}`, (err, rows) => {
            if (!err) {
                resolve(true);
            } else {
                resolve(false);
                console.log(err);
            }
        })
    })
}
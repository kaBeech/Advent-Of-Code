import geserBataBatunyaKeBawa from "./geserBataBatunyaKeBawa.ts";
import hitungBatuBataDiBawahnya from "./hitungBatuBataDiBawahnya.ts";
import type { Bata, Suara } from "./jenis";

export default (daftarBatuBata: Bata[]) => {
    // Set the number of bricks that can be disintegrated calmly to 0
    let jumlahBatuBataYangDapatHancurDenganTenang = 0

    // Mark all bricks that are unable to be disintegrated calmly
    for (const bata of daftarBatuBata) {

        // Keep a total of bricks below the current brick
        const batuBataDiBawahnya = [] as Bata[]

        // For each voxel in the current brick, check if there is a brick
        // directly below it.
        for (const suara of bata.suara) {
            const bataRendah = hitungBatuBataDiBawahnya(daftarBatuBata, suara)

            // If there is a brick below the current brick and its ID is not 
            // already on the list, add it to the list
            if (bataRendah && !batuBataDiBawahnya.find((bata2) => bata2.pengenal === bataRendah.pengenal)) {
                batuBataDiBawahnya.push(bataRendah)
            }
        }

        // If there is only one brick below the current brick, mark that brick 
        // as unable to be calmly disintegrated
        if (batuBataDiBawahnya.length === 1) {
            batuBataDiBawahnya[0].dapatHancur = false
        }
    }

    // Set the total sum posiibilities of bricks that could be shifted, if a 
    // brick were be disintegrated, to 0
    let jumlahBatuBataYangAkanGeser = 0

    for (const bata of daftarBatuBata) {

        // If the brick can be disintegrated calmly, add it to the total sum of
        // bricks that can be disintegrated calmly
        if (bata.dapatHancur) {
            jumlahBatuBataYangDapatHancurDenganTenang++

            // Otherwise, find how many bricks would be shifted if it were 
            // disintegrated
        } else {

            // Create a copy of the list of bricks that don't include the current brick
            const daftarBatuBataYangDifilter = daftarBatuBata.slice().filter((bata2) => bata2.pengenal !== bata.pengenal)
            const daftarBatuBataYangDifilterKlon: Bata[] = []

            for (const bata of daftarBatuBataYangDifilter) {
                const bataKlon = {
                    pengenal: bata.pengenal.valueOf(),
                    suara: [] as Suara[],
                    dapatHancur: bata.dapatHancur.valueOf(),
                    zTertinggi: bata.zTertinggi.valueOf(),
                    zTerendah: bata.zTerendah.valueOf(),
                }
                for (const suara of bata.suara) {
                    bataKlon.suara.push({
                        penegalBata: suara.penegalBata.valueOf(),
                        koordinat: {
                            x: suara.koordinat.x.valueOf(),
                            y: suara.koordinat.y.valueOf(),
                            z: suara.koordinat.z.valueOf(),
                        }
                    })
                }
                daftarBatuBataYangDifilterKlon.push(bataKlon)
            }

            // Add the number of bricks that would be shifted to the total sum 
            // of possibile brick shifts
            jumlahBatuBataYangAkanGeser += geserBataBatunyaKeBawa(daftarBatuBataYangDifilterKlon).batuBataYangTelahDigeser;
        }
    }

    return { jumlahBatuBataYangDapatHancurDenganTenang, jumlahBatuBataYangAkanGeser };
};
